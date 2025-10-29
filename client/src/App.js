import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BuySell from "./pages/BuySell";
import Material from "./pages/Material";
import Connect from "./pages/Connect";
import Reviews from "./pages/Reviews";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";

import Layout from "./components/Layout";


function App() {
return (
  <Router>
    <Routes>
         <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout/>} >
      <Route path="/" element={<h1>Welcome to Campus Connect</h1>} />
      <Route path="/home" element={<Home/>}/>
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/buy-sell" element={<BuySell/>} />
      <Route path="/materials" element={<Material/>}/>
      <Route path="/connect" element={<Connect/>}/>
      <Route path="/reviews" element={<Reviews/>}/>
      </Route>
    </Routes>
  </Router>
);

}

export default App;
