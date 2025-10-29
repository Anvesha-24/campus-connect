import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import axios from "axios";

function Register(){
    const [formdata,setFormData]=useState({
       name:"",
       email:"",
       password:"",
       year:"",
       branch:"",
    });

    const navigate=useNavigate();


    const handleSubmit=async(e)=>{
       e.preventDefault();
       console.log("Register data:",formdata);

       try{
        //send data to backend
        const res=await axios.post("http://localhost:5000/api/users/register",formdata);

        alert(res.data.message);
        navigate("/login");
       }
       catch(error)
       {
        console.error("Registration error:",error);
        if(error.response && error.response.data.message)
        {
            alert(error.response.data.message);
        }
        else{
            alert("Something went wrong.Try again!");
        }
       }
    };

    const handleChange=(e)=>{
              setFormData({...formdata,[e.target.name]: e.target.value});
    };

    return (
        <div className=" flex items-center justify-center min-h-screen bg-blue-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <h2 className="text-center text-3xl mt-3 font-bold">Register</h2>

            <form onSubmit={handleSubmit}>

                <input className="w-full border border-gray-300 rounded py-2 mt-3 pl-2" name="name" placeholder="Name" required onChange={handleChange}></input>
                <input className="w-full border border-gray-300 rounded py-2 mt-3 pl-2" type="email" name="email" placeholder="Email" required onChange={handleChange}></input>
                <input className="w-full border border-gray-300 rounded py-2 mt-3 pl-2"type="password" name="password" placeholder="Password" required onChange={handleChange}></input>
                <input className="w-full border border-gray-300 rounded py-2 mt-3 pl-2"name="year" placeholder="Year(1st,2nd,3rd...)" required onChange={handleChange}></input>
                <input className="w-full border border-gray-300 rounded py-2 mt-3 pl-2"name="branch" placeholder="Branch(CSE,IT...)" required onChange={handleChange}></input>

                <button className="block text-center mx-auto mt-2 bg-blue-500 text-white p-2 mt-4 rounded-md "type="submit">Register</button>
            </form>
            <p className="mt-2 text-center">Already have an account? <Link to="/login" className="text-blue-600">Login here</Link></p>
        </div>
        </div>
    );
}
export default Register;