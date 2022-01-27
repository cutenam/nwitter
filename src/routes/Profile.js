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
import { useNavigate } from "react-router-dom";    // v6


// export default ()=> <span>Profile</span>;
// const Profile = ()=> <span>Profile</span>;
const Profile = ({refreshUser, userObj}) => {

    // userObj 를 상위 컴포넌트에서 받지 않고, auth모듈 통해서 가져올 수도 있지 않나?
    // authService.currentUser.uid 이러한 방식으로...
    // 그러나, 모든 컴포넌트에서 모듈을 이용해서 읽거나, 업데이트하게되면, 사용자 정보가 변경의 일관성이 없어지게 됨
    // 리액트 프레임웍의 기능을 이용해서, 한 곳에서 정보의 변화를 관리하고, 변경되면 다른 컴포넌트에도 동일하게 변경될수 있도록 함(리렌더링)

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
        // 없으면, 컴포넌트 렌더링 에러 발생, userObj 재설정 해줌...
        // refreshUser();
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
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            // await updateProfile(userObj, {displayName: newDisplayName});
            /**
             * Uncaught (in promise) TypeError: userInternal.getIdToken is not a function
             *     at updateProfile (account_info.ts:50:1)
             *     at onSubmit (Profile.js:90:1)
             *     at HTMLUnknownElement.callCallback (react-dom.development.js:3945:1)
             *     at Object.invokeGuardedCallbackDev (react-dom.development.js:3994:1)
             *     at invokeGuardedCallback (react-dom.development.js:4056:1)
             *     at invokeGuardedCallbackAndCatchFirstError (react-dom.development.js:4070:1)
             *     at executeDispatch (react-dom.development.js:8243:1)
             *     at processDispatchQueueItemsInOrder (react-dom.development.js:8275:1)
             *     at processDispatchQueue (react-dom.development.js:8288:1)
             *     at dispatchEventsForPlugins (react-dom.development.js:8299:1)
             */
            // App.js 에서 처음 만들어진 사용자 정보 객체 (userObj) 를 파이어베이스 auth데이터와 동기화 시켜주는 역할
            // 이 함수는 App.js　에서 props 형태로 하위 컴포넌트로 계속 전달됨
            refreshUser();
        }
    }

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input className="formInput" onChange={onChange} type="text" placeholder="Display name" value={newDisplayName} autoFocus/>
                <input className="formBtn" type="submit" value="Update Profile"
                       style={{
                           marginTop: 10,
                       }}
                />
            </form>
            
            {/*<button onClick={onLogoutClick}>Log Out</button>*/}
            <span className="formBtn cancelBtn logOut" onClick={onLogoutClick}>
             Log Out
           </span>
        </div>
    )
};
export default Profile;