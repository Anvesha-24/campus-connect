import React from 'react';
import { Link } from 'react-router-dom';

function Home () {

  return (
    <div className='min-h-screen flex items-center justify-center bg-blue-300'>
      <div className='max-w-xl bg-white p-10 rounded-2xl text-center  '>
        <h1 className='text-4xl font-bold mb-10 '>Welcome to Campus Connect 🎓</h1>

        <p className='text-xl text-gray-500'>Your student hub to buy/sell ,exchange material,connect with seniors,and much more!</p>
        <div className=''>
            <Link to="/login">
            <button className='bg-gray-200 p-2 mt-10 rounded-md font-bold mr-10 border border-gray-500'>
                Login
            </button>
            </Link>
            <Link to="/register">
            <button className='bg-gray-200 p-2  rounded-md font-bold border border-gray-500'>
                Register
            </button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Home
