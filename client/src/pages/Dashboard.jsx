import React,{use, useEffect} from 'react';
import {Link,useNavigate} from "react-router-dom";

function Dashboard ()  {

    const user=JSON.parse(localStorage.getItem("user"));

    const navigate=useNavigate();

    useEffect(()=>{
      const isLoggedIn=localStorage.getItem("loggedIn");
      if(!isLoggedIn){
        alert("please login first");
        navigate("/login")
      }
    },[]);

  return (
    <div className='flex justify-center items-center min-h-screen bg-blue-200 w-full '>
    <div className='max-w-sm bg-white p-10 m-10 rounded-md'>
      <h1 className='text-4xl font-bold mb-4'>Welcome,{user?.name || "student"}</h1>

      <div className=''>
        <Link to="/buy-sell" className=''>
        <h2 className='text-2xl text-blue-900'>Buy/Sell Items</h2>
        <p className='mb-5'>Browse or post products to exchange on Campus</p>
</Link>

<Link to="/materials" className=''>
<h2 className='text-2xl text-blue-900'>Study Material</h2>
<p className='mb-5'>Share and access important notes and PYQ'S</p>
</Link>


<Link to="/connect" className=''>
<h2 className='text-2xl text-blue-900'>Connect with Seniors</h2>
<p className='mb-5'>Ask questions,seek help or career guidance</p>
</Link>

<Link to="/reviews" className=''>
<h2 className='text-2xl text-blue-900'>Reviews</h2>
<p className=''>Read and post reviews for subjects or faculty</p>
</Link>


</div>
      </div>
    </div>
  )
}

export default Dashboard
