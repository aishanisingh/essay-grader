import { connectToDatabase } from "../../lib/mongodb";

const spell = require("spell-checker-js");
const stringSimilarity = require("string-similarity");
const prepositions = ["with", "at", "by", "to", "in", "for", "from", "of", "on"];
const nasties = ["very", "really", "got", "get", "getting", "gotten"];

export default async function handler(req, res) {

  const dataInReq = req.body;
  let wordCount = dataInReq.essay.match(/(\w+)/g).length;

    // Prepositions
    let prepcounter = 0;
    let substrings = dataInReq.essay.split('.');
    for (const strings of substrings) {
        let splitstrings = strings.split(' ');
        for (const preposition of prepositions) {
            if (splitstrings[splitstrings.length - 1] == preposition) {
                prepcounter++;
            }
        }
    }

    // Nasty no-no's
    let nastycounter = 0;
    let spaces = dataInReq.essay.toLowerCase().split(' ');
    for (const space of spaces) {
        let punctuationless = space.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        let finalString = punctuationless.replace(/\s{2,}/g," ");
        for (const nasty of nasties) {
            if (finalString == nasty) {
                nastycounter++;
            }
        }
    }
 

  // Wordcount
  let wordCountErrors = wordCount < 500 || wordCount > 1000  ? 1 * 50 : 0;
  
  // Spelling errors  Load dictionary
  spell.load('en')  
  // Checking text
  const spellCheckErrors = spell.check(dataInReq.essay).length; 
  
  //Plagirism
  let { client } = await connectToDatabase();
  let db =  client.db(process.env.MONGODB_DB);
  // Fetch essays for other kids from Database
  const dbitems = await db.collection("grades_new")
                    .find({
                        'name': {$ne: dataInReq.firstName + " " + dataInReq.lastName },
                    })
                    .toArray();
  
  let plgd = false;

  // Iterate through to do the comparison
  for (const dbitem of dbitems) {
    if (!dbitem.essay) continue;

    let similarity = stringSimilarity.compareTwoStrings(dbitem.essay, dataInReq.essay);

    if (similarity > 0.8) {
        plgd = true; break;
    }
  }
  
  // Time to find the totalscore 
  let totalScore = plgd ? 0 : 100 - wordCountErrors - 3 * spellCheckErrors - 5 * prepcounter - nastycounter;

  let plgdScore = plgd ? 100 : 0;
  let grade = {
      totalScore : totalScore,
      scores : [
          {type: "WordCount", score: wordCountErrors},
          {type: "SpellCheck", score: 3 * spellCheckErrors},
          {type: "Plagiarism", score: plgdScore },
          {type: "Preposition", score: 5 * prepcounter},
          {type: "Nasty No-no's", score: nastycounter},
      ]
    }

  // Save to Database  
  const query = { name: dataInReq.firstName + " " + dataInReq.lastName };
  const update = { $set: { grade: grade, 
                            firstName: dataInReq.firstName, 
                            lastName: dataInReq.lastName,
                            essay: dataInReq.essay,
                        }};
  const options = { upsert: true };
  await db.collection("grades_new").updateOne(query, update, options);

  // Return response
  res.status(200).json({ data: grade });
}