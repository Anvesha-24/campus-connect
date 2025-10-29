import React,{useState,useEffect} from 'react'

function Reviews () {

const[reviews,setReviews]=useState([]);
const[form,setForm]=useState({
    subject:'',
    faculty:'',
    comment:''
});

useEffect(()=>{
    const stored=JSON.parse(localStorage.getItem('reviews'))|| [];
    setReviews(stored);
},[]);

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit=(e)=>{
e.preventDefault();
const updated=[...reviews,form];
setReviews(updated);
localStorage.getItem('reviews',JSON.stringify(updated));
setForm({subject:'',faculty:'',comment:''});
};



  return (
    <div className="min-h-screen bg-blue-100 p-6 flex justify-center items-center">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow max-w-sm">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Course / Faculty Reviews</h1>

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            name="subject"
            placeholder="Subject / Faculty name"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full p-4 mb-3 border rounded"
          />
          <textarea
            name="comment"
            placeholder="Your review or feedback"
            value={form.comment}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-6 mb-5 border rounded"
          ></textarea>
          <button
            type="submit"
            className="w-full font-bold bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-2">Student Reviews:</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((item, index) => (
              <div key={index} className="p-4 bg-blue-50 border rounded">
                <h3 className="font-bold">{item.subject}</h3>
                <p>{item.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews submitted yet.</p>
        )}
      </div>
    </div>
  );
}

export default Reviews; 