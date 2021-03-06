import React, {useState, useEffect} from "react";
import {BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";


const Navigation = ({userObj}) => {
    console.log("Navigation :", userObj);
    console.log(userObj.displayName);
    return (
        <nav>
            <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
                <li>
                    {/*<Link to="/" elements={<Home/>}>HOME</Link>*/}
                    <Link style={{ marginRight: 10 }} to="/" elements={<Home/>}>
                        <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
                    </Link>
                </li>
                <li>
                    {/*<Link to="/profile" elements={<Profile/>}>{userObj.displayName}'s My Profile</Link>*/}
                    <Link style={{
                        marginLeft: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: 12,
                    }} to="/profile" elements={<Profile/>}>
                        <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
                        <span style={{ marginTop: 10 }}>
             {userObj.displayName
                 ? `${userObj.displayName}의 Profile`
                 : "Profile"}
           </span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
};

export default Navigation;