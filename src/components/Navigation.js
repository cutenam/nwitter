import React, {useState, useEffect} from "react";
import {BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";


const Navigation = ({userObj}) => {

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/" elements={<Home/>}>HOME</Link>
                </li>
                <li>
                    <Link to="/profile" elements={<Profile/>}>{userObj.displayName}'s My Profile</Link>
                </li>
            </ul>
        </nav>
    )
};

export default Navigation;