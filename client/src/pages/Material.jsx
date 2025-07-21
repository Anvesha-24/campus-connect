import React,{useState,useEffect} from 'react'

function Material () {
const[materials,setMaterials]=useState([]);
const [form,setForm]=useState({
    subject:'',
    description:'',
    link:''
});

useEffect(()=>{
    const stored=JSON.parse(localStorage.getItem('materials')) || [];
    setMaterials(stored);
},[]);


const handleChange=(e)=>
{
 setForm({...form,
    [e.target.name]:e.target.value});
};

const handleSubmit=(e)=>{
    e.preventDefault();
    const updated=[...materials,form];
    setMaterials(updated);
    localStorage.setItem('materials',JSON.stringify(updated));
    setForm({subject:'',description:'',link:''});
};

  return (
    <div className='min-h-screen bg-blue-100 p-6 flex justify-center items-center'>
      <div className='w-full max-w-md mx-auto bg-white p-6 rounded shadow'>
        <h1 className='text-3xl font-bold mb-4 text-blue-900'>Study Materials</h1>
        {/*submission form*/}

        <form onSubmit={handleSubmit} className='mb-6'>

            <input
            type="text"
            name="subject"
            placeholder='subject (eg-Maths,mechanical...)'
            value={form.subject}
            onChange={handleChange}
            required
            className='w-full p-2 mb-2 border border-gray rounded'
            />

            <input 
            type='text'
            name='description'
            placeholder='short description'
            value={form.description}
            onChange={handleChange}
            required
            className='w-full p-2 mb-2 border border-gray rounded'
            />

            <input
            type='url'
            name='link'
            placeholder='Google drive / resource link'
            value={form.link}
            onChange={handleChange}
            required
            className='w-full p-2 mb-2 border border-gray rounded'
            />

            <button
            type="submit"
            className='w-full p-2 mb-2 border border-gray rounded bg-blue-600 text-white font-bold'>
                Submit Material
            </button>
        </form>

{/* materials list */}
        <h2 className="text-xl font-semibold mb-2">Available Materials:</h2>
        {materials.length > 0 ? (
          <div className="space-y-4">
            {materials.map((item, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded border">
                <h3 className="text-lg font-bold">{item.subject}</h3>
                <p>{item.description}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Material
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No materials submitted yet.</p>
        )}
      </div>
    </div>
  );
}


export default Material

