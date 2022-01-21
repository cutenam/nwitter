import React from "react";
import {authService} from "firebaseInstance";
// import {useHistory} from "react-router-dom";  // v5
import {useNavigate} from "react-router-dom";    // v6

// export default ()=> <span>Profile</span>;
// const Profile = ()=> <span>Profile</span>;
const Profile = ()=> {
    // const history = useHistory();
    const navigate = useNavigate();
    // 로그아웃 이후, /이하 경로 입력시, URL 변경되도록 변경, Router.js　에서 정의해도 되고, 훅을 이용하여 사용해도 된다
    //  - (리액트 5.x) Redirect 사용, 훅 : useHistory
    //  - (리액트 6.x) Routes 사용, 훅 : useNavigate
    // 훅 사용시, uselocation
    /**
     * 로그아웃 버튼
     * 파이어베이스 모듈 API signOut 호출
     * @returns {Promise<void>}
     */
    const onLogoutClick = () => {
        authService.signOut();
        // history.push("/");
        navigate("/");
    };

    return (
        <>
            <button onClick={onLogoutClick}>Log Out</button>
        </>
    )
};
export default Profile;