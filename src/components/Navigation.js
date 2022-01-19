import React from "react";
import {BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";


const Navigation = () => <nav>
    <ul>
        <li>
            <Link to="/" elements={<Home/>} >HOME</Link>
        </li>
        <li>
            <Link to="/profile" elements={<Profile/>} >My Profile</Link>
        </li>
    </ul>
</nav>

export default Navigation;