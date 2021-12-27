import React, {useState} from "react";
// import {HashRouter as Router, Route, Switch, useSearchParams} from "react-router-dom";
import {HashRouter as Router, Route, Routes} from "react-router-dom";

import Auth from "../routes/Auth";
import Home from "../routes/Home";

// 로그인 여부에 따라
const AppRouter= () => {
    // 로그인 여부 스테이트
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    /*  <></<> fragment : 여러 엘리먼트들을 렌더링할 필요가 있을때, 그것을 한번에 모아 렌더링이 가능하도록 빈 엘리번트로 감싸줌 */
    // Switch는 한번에 하나의 Router 만 렌더링 가능
    return <Router>
        {/*<Switch>*/}
        <Routes>
            {isLoggedIn ? (
                    <>
                        <Route exact path="/" element={<Home/>} >
                            {/*<Home/>*/}
                        </Route>
                    </> )
                : ( <Route exact path="/" element={<Auth/>}>
                        {/*<Auth />*/}
                    </Route>
                )}
        </Routes>
    </Router>
};

export default AppRouter;