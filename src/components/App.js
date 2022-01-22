import React, {useEffect, useState} from "react";
// import AppRouter from "./Router";
// import firebase from "../firebase";  // firebase.js 를 상대경로로 임포트, 절대경로로 임포트하기 위해서 jsconfig.json　파일에 루트 디렉토리를 설정해주면 가능함
import AppRouter from "components/Router";
// import firebase from "firebaseInstance";
import {firebaseApp, authService} from "firebaseInstance";
// import authService from "firebaseInstance";

/**
 * App
 * @returns {JSX.Element}
 * @constructor
 *
 * 1. 로그인 여부 확인 : authService.currentUser
 *  - 앱이 실행되어, 파이어베이스 모듈이 실행되는 시간이 걸리므로, 로그인되어있는 사용자 정보를 바로 보여줄 수 있도록 개선 필요 *
 */

// App.js　에서 어플리케이션의 모든 로직을 핸들링하도록 구조를 잡을거라 함
function App() {

  // const auth = fbase.auth();
  const auth = authService;
  // 유저를 가져와서 로그인 여부를 판단하도록 하는 것!
  // console.log(auth.currentUser);
  const authCurrentUser = auth.currentUser;
  // auth.currentUser : 처음에는 null　값이 찍히고, 시간이 지나야 로그인 정보가 보임
  // 왜냐하면, 앱실행 후 파이어베이스 연동 시간이 걸리기 때문 => onAuthStateChanged 사용
  // setInterval(()=>{
  //     console.log(auth.currentUser);
  // }, 2000);

  // 파이어베이스 초기화 여부 확인 변수
  const [init, setInit] = useState(false);

  // 로그인 여부 스테이트 -> Router.js에 props로 전달함
  // const [isLoggedIn, setIsLoggedIn] = useState(authCurrentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 현재 로그인된 사용자 정보 스테이트
  const [userObj, setUserObj] = useState(null);

  // onAuthStateChanged : 사용자의 인증 관련(생성, 로그인, 로그아웃등) 이벤트 발생
  // 로그아웃은 브라우저 indexedDB데이터를 삭제하면 이벤트 발생함
  // 실제 로그인된 시점을 알 수 있음
  useEffect(()=>{
      authService.onAuthStateChanged((user) => {
          // console.log(user);
          // 사용자 정보가 있으면 로그인 된것으로,,,
          if (user) {
            setIsLoggedIn(true);
            setUserObj(user);   // 로그인된 사용자 정보, AppRouter 컴포넌트에 프로퍼티로 보냄
          } else {
            setIsLoggedIn(false);
          }
          // 파이어베이스가 구동된 것으로 함
          setInit(true);
      })
  }, []);

  return (
      <>
          {/* 파이어베이스 초기화 여부에 따라 메뉴 오픈 여부 처리 */}
          {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initialilizing..."}
          <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
      </>

  );
}

export default App;
