import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    branch: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Register data:", formdata);

    try {
      const res =await axios.post("http://localhost:5000/api/users/register", formdata);

      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Something went wrong. Try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 px-4">
      <div className="bg-gradient-to-tr from-slate-300 via-slate-200 to-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
        <h2 className="text-center text-3xl sm:text-4xl  mb-6 font-sans font-bold leading-normal">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "password", "year", "branch"].map((field, idx) => (
            <input
              key={idx}
              type={field === "email" ? "email" : field === "password" ? "password" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
              value={formdata[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-500 transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
