import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import axios from "axios";

function Login(){
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const navigate=useNavigate();

const handleSubmit=async(e)=>{
e.preventDefault();
console.log("login data:",{email,password});

try{
    const res=await axios.post("http://localhost:5000/api/users/login",{
        email,
        password,
    });

console.log("Login response:",res.data);

//save token and user info
localStorage.setItem("token",res.data.token);
localStorage.setItem("user",JSON.stringify(res.data.user));

alert("Login successfully");
navigate("/dashboard");
}
catch(err)
{
    console.error("Login error:",err.response?.data?.message||err.message);
    alert("Invalid email or password");
}
};



    return (
<div className="flex items-center justify-center min-h-screen bg-blue-100">
    <div className="bg-white p-6 rounded-lg ">
    <h2 className="text-3xl font-bold text-center mb-6  ">Login</h2>
    <form onSubmit={handleSubmit}>
        <input className="w-full p-2 border border-gray-300 rounded mb-2"
        type="email"
        placeholder="email"
        required
        onChange={(e)=>setEmail(e.target.value)}
        ></input>
        <input className="w-full p-2 border border-gray-300 rounded"
        type="password"
        placeholder="password"
        required
        onChange={(e)=>setPassword(e.target.value)}
        ></input>

        <button className=" block bg-blue-500 text-white py-2 mt-4 rounded-md p-4 mx-auto" type="submit">Login</button>
    </form>
 <p className="text-center mt-3">Don't have an account? <Link to="/register" className="text-blue-600">Register here</Link></p>
</div>
</div>
    );
}
export default Login;