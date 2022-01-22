import React from "react";
// import {HashRouter as Router, Route, Switch, useSearchParams} from "react-router-dom";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";

import Navigation from "components/Navigation";

// 로그인 여부에 따라
const AppRouter= ({isLoggedIn, userObj}) => {
    // 로그인 여부 스테이트 -> App.js 로 이동함
    // const [isLoggedIn, setIsLoggedIn] = useState(true);
    /*  <></<> fragment : 여러 엘리먼트들을 렌더링할 필요가 있을때, 그것을 한번에 모아 렌더링이 가능하도록 빈 엘리번트로 감싸줌 */
    // Switch는 한번에 하나의 Router 만 렌더링 가능
    return (
        <BrowserRouter>
            {/* isLoggedIn　이 true 일때  Navigation 이 보임, false 이면  isLoggedIn 이 보임*/}
            {isLoggedIn && <Navigation /> }
            <Routes>
                {
                    isLoggedIn ?
                    (
                        <>
                            <Route path="/" element={<Home userObj={userObj}/>} />
                            <Route path="/profile" element={<Profile/>} />
                            {/*<Route path="/*" element={<Navigate replace to="/" /> }/>*/}
                        </>
                    )
                    :
                    (
                        <>
                            <Route path="/" element={<Auth/>} />
                            {/*<Route path="/*" element={<Navigate replace to="/" />}/>*/}
                        </>

                    )
                }
            </Routes>
        </BrowserRouter>
    )};

export default AppRouter;