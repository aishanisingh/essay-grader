import { connectToDatabase } from "../lib/mongodb";

export default function Home({ dbitems }) {
    return (
        <div className="w-full max-w-3xl m-auto py-10 mt-10 px-10 border">
            <h3 className="text-center text-4xl font-semibold mb-8">Students Essay Score</h3>

            <table className="w-full">
            <thead>
                <tr>
                <th className="border px-4 py-2 text-xl text-center">Name</th>
                <th className="border px-4 py-2 text-xl text-center">Score</th>
                </tr>   
            </thead>
            <tbody>
                {dbitems && dbitems.map(dbitem => (
                    <tr>
                        <td className="border px-4 py-2 text-center">{ dbitem.name }</td> 
                        <td className="border px-4 py-2 text-center">{ dbitem.grade.totalScore }</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export async function getServerSideProps(context) {
    let { client } = await connectToDatabase();
    let db =  client.db(process.env.MONGODB_DB);
  
    // Fetch items for all kids from Database
    const dbitems = await db.collection("grades_new")
                      .find({})
                      .project({"name": 1, "grade.totalScore":1, _id:0})
                      .toArray(); 
    console.log(JSON.stringify(dbitems))
   return {
       props: { dbitems: dbitems},
   }
}