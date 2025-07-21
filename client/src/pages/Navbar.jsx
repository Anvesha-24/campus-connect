import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar () {

const navigate=useNavigate();
const user=JSON.parse(localStorage.getItem("user"));

const handleLogout=()=>{
    localStorage.removeItem("user");
    navigate("/login");
};

  return (
    <nav className=' bg-blue-700 text-white shadow-md h-16'>
        <div className='max-w-7xl mx-auto flex justify-between items-center '>

    <div className='text-4xl font-bold mr-10 text-center pt-2'>
        <Link to="/home">Campus Connect</Link>
    </div>

    <ul className='flex space-x-8 items-center text-xl '>
        <li><Link to="/dashboard" className='underline'>Dashboard</Link></li>
        <li><Link to="/buy-sell" className='underline'>Buy/Sell</Link></li>
        <li><Link to="/connect" className='underline'>Connect</Link></li>
        <li><Link to="/materials" className='underline'>Materials</Link></li>
        <li><Link to="/reviews" className='underline'>Reviews</Link></li>
</ul>

<div>
{user?(
    <li>
        <button onClick={handleLogout} className='bg-blue-200 rounded-md p-1 mt-3 text-blue-900'>
            Logout
        </button>
    </li>
):(
    <div><Link to="/login" className='bg-blue-200 rounded-md p-2 mt-3 text-blue-900 font-bold flex '>Login</Link></div>
)}
    </div>
      </div>
    </nav>
  );
}

export default Navbar
