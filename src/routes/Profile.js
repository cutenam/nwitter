import React, {useEffect, useState} from "react";
import {authService, dbService} from "firebaseInstance";
import {collection, addDoc, getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
    serverTimestamp} from "firebase/firestore";
import { updateProfile } from "firebase/auth";  // v9
// import {useHistory} from "react-router-dom";  // v5
import {useNavigate} from "react-router-dom";    // v6


// export default ()=> <span>Profile</span>;
// const Profile = ()=> <span>Profile</span>;
const Profile = ({userObj}) => {

    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

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

    const getMyNweets = async() => {
        //v8, 특정 조건의 도큐먼트 조회(필터링)
        // const nweets = await dbService.collection("").where("creatorId", "==", userObj.uid).orderBy("createdAt").get();
        // noSQL DB는 where, orderby 사용시, 색인을 미리 만들어놔야함 (파이어베이스 파일스토어 콘솔에서)
        // console.log(nweets.docs.map((doc) => doc.data()));

        // console.log(userObj.uid);
        //v9
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc"),
            where("creatorId", "==", `${userObj.uid}`)
        );

        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot.size);

        querySnapshot.forEach(doc => {
            // console.log(doc.id, "=>", doc.data());
            // console.log(doc);
        });

    };
    // 
    useEffect(()=> {
        getMyNweets();
    }, []);

    const onChange = (e) => {
        const {
            target: {value}
        } = e;
        setNewDisplayName(value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (userObj.displayName !== newDisplayName) {
            //v8
            // console.log(userObj.updateProfile);
            // 응답값이 없음
            // await userObj.updateProfile({
            //     displayName: newDisplayName
            // })

            //v9
            await updateProfile(userObj, {displayName: newDisplayName});
        }
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName}/>
                <input type="submit" value="Update Profile"/>
            </form>
            
            <button onClick={onLogoutClick}>Log Out</button>
        </>
    )
};
export default Profile;