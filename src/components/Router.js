import React from "react";
import {BrowserRouter, Navigate, Route, Routes, HashRouter} from "react-router-dom";

import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";

import Navigation from "components/Navigation";

// 로그인 여부에 따라
const AppRouter= ({refreshUser, isLoggedIn, userObj}) => {
// const AppRouter= ({refreshUser, userObj}) => {
    console.log("Router.js: ", userObj)
    // console.log("isLoggedIn :", isLoggedIn)
    // 로그인 여부 스테이트 -> App.js 로 이동함
    // const [isLoggedIn, setIsLoggedIn] = useState(true);
    /*  <></<> fragment : 여러 엘리먼트들을 렌더링할 필요가 있을때, 그것을 한번에 모아 렌더링이 가능하도록 빈 엘리번트로 감싸줌 */
    // Switch는 한번에 하나의 Router 만 렌더링 가능
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
        {/*<HashRouter basename="/">*/}
            {/* isLoggedIn　이 true 일때  Navigation 이 보임, false 이면  isLoggedIn 이 보임*/}
            {isLoggedIn && <Navigation userObj={userObj} /> }
            <div
                style={{
                    maxWidth: 890,
                    width: "100%",
                    margin: "0 auto",
                    marginTop: 80,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Routes>
                    {
                        isLoggedIn ?
                        // Boolean(userObj)?
                        (
                            <>
                                <Route path="/" element={<Home userObj={userObj}/>} />
                                <Route path="/profile" element={<Profile refreshUser={refreshUser} userObj={userObj}/>} />
                                {/*<Route path="/*" element={<Navigate replace to="/" /> }/>*/}
                            </>
                        )
                        :
                        (
                            <>
                                <Route path="/" element={<Auth/>} />
                                <Route path="/*" element={<Navigate replace to="/" />}/>
                            </>

                        )
                    }
                </Routes>
            </div>
        </BrowserRouter>
    )};

export default AppRouter;