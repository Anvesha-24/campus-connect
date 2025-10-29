import React,{useState,useEffect} from 'react'

function Connect()  {

const[posts,setPosts]=useState([]);
const[form,setForm]=useState({
    name:'',
    question:''
});

useEffect(()=>{
const stored=JSON.parse(localStorage.getItem('connectPosts'))||[];
setPosts(stored);
},[]);

const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value});
};
const handleSubmit=(e)=>{
    e.preventDefault();
    const updated=[...posts,form];
    setPosts(updated);
    localStorage.getItem('connectPosts',JSON.stringify(updated));
    setForm({name:'',question:''});

};

  return (
    <div className='min-h-screen bg-blue-300 p-6 flex justify-center items-center'>
        <div className='max-w-2xl mx-auto bg-white p-6 rounded shadow'>

            <h1 className='text-4xl font-bold text-blue-800 mb-10'>Connect with Seniors</h1>
            <form onSubmit={handleSubmit} className='mb-6'>
                <input 
                type="text"
                name="name"
                placeholder="your name"
                value={form.name}
                onChange={handleChange}
                required
                className='w-full p-2 mb-4 border border-gray-300 rounded-md'
                />

                <textarea
                name="question"
                placeholder="Ask a question/guidance advice"
                value={form.question}
                onChange={handleChange}
                required
                className='w-full p-2 mb-6 border border-gray-300 rounded-md'
                rows="4"
                ></textarea>
                <button
                type="submit"
                className=" w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-bold">
                    Post Question
                </button>
            </form>

<h2 className='text-xl font-semibold mb-2'>Questions from juniors:</h2>
{posts.length>0?
(
    <div className="space-y-4">
    {posts.map((item,index)=>(
        <div key={index} className='p-4 bg-blue-100 rounded border'>
            <h3 className='font-bold text-blue-900'>{item.name}</h3>
            <p className=''>{item.question}</p>
        </div>
    ))}
    </div>
):(
    <p className='text-gray-600'>No questions yet.</p>
)}
</div>
</div>
);
}


export default Connect;
