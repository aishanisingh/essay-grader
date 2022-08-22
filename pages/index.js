import React from "react";
import { useForm } from "react-hook-form";

export default function Home() {

    const { register, errors, handleSubmit, rule } = useForm();
    const [grade, setGrade] = React.useState(null)
    const [isLoading, setLoading] = React.useState(false)

    const onSubmit = async (data, e) => { 
    
        setLoading(true)    
        const location = window.location.hostname;
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({firstName: data.firstName, lastName: data.lastName, essay: data.essay})
        };
        const response = await fetch(`http://${location}:3000/api/essaygrader/`, settings);
        const resData = await response.json();

        setGrade(resData.data);
        setLoading(false);      
    }

    const onError = (errors, e) => {
        console.log(errors, e);
    }

    return (

        <React.Fragment>  
            <form
            className="w-full max-w-3xl m-auto py-10 mt-10 px-10 border"
            onSubmit={handleSubmit(onSubmit, onError)}
            >
            <h3 className="text-center text-4xl font-semibold mb-8">Grade your Essay</h3>
            {isLoading && (<div className="px-2 py-3 font-bold text-2xl">Sit tight..Grading in progress</div>)}    

            {grade && (
                <div className="pb-5">
                    <div className="bg-blue-100 border-t border-b border-blue-500 px-2 py-3" role="alert">
                        <p className="font-bold text-2xl">Your total score is: { grade.totalScore } </p> 
                        <p className="text-xl">Points were taken away for: 
                            <span className="pl-2">{grade.scores.length > 0 && grade.scores.map(s => (
                                    <span>{s.type} - {s.score} &nbsp;&nbsp;</span>
                                ))} 
                            </span>                      
                        </p>                   
                    </div>
                </div>
            )}
            
            <label className="text-gray-600 font-bold text-xl">First Name</label>
            <input className="border-solid border-gray-300 border py-2 px-2 w-full
            rounded" autoFocus {...register("firstName")}
            />
        
            <label className="text-gray-600 font-bold block mt-4 text-xl">Last Name</label>
            <input className="border-solid border-gray-300 border py-2 px-2 w-full
            rounded" {...register("lastName")}
            />     

            <label className="text-gray-600 font-bold block mt-4 text-xl">
            Please paste your Essay here
            </label>
            <textarea
                className="border-solid border-gray-300 border py-2 px-2 w-full rounded"
                rows={10}
                cols={5}
                {...register("essay")}
            />

            <button
                className="mt-4 w-full bg-green-400 hover:bg-green-600 text-green-100 border shadow py-3 px-6 font-semibold text-md rounded"
                type="submit"
            >
                Submit
            </button>
            </form>
        </React.Fragment>    
    )
}