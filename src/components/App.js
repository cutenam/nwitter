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

            // console.log(user.updateProfile);  // v9 버전에서는 undefined

            // 소셜로그인 외의 사용자인 경우, displayName 정보가 없으므로,　이메일정보를 임의로 넣어줌
            if (!user.displayName) {
                user.displayName = user.email;
            }
            // 리액트가 스테이트변수의 오브젝트 데이터 변경 여부를 체크시, 데이터가 크고 복잡하면,
            // 성능상 문제가 있을수 있으므로, 필요한 데이터들로만 이루어진 오브젝트를 만듬
            // setUserObj(user);   // 로그인된 사용자 정보, AppRouter 컴포넌트에 프로퍼티로 보냄
            setUserObj({
                displayName : user.displayName,
                uid: user.uid,
                // updateProfile: user.updateProfile({})
                // v8, 데이터가 함수형태이므로, 실제 함수에서 값을 가져오는 래퍼함수로 선언함
                // v9 버전에서는 별도 API 로 나누어졌기때문에, 필요없음
                // updateProfile: (args) => user.updateProfile(args)
            });
            // console.log(user);

            // 두번째 방법
            // setUserObj(user);


          } else {
            setIsLoggedIn(false);
          }
          // 파이어베이스가 구동된 것으로 함
          setInit(true);
      })
  }, []);

  // 현재 사용자를 새로고침해주는 기능의 함수
  // Profile.js 에서 프로파일 이름(displayName)을 파이어베이스 모듈을 통해 업데이트 시,
  // 리액트에서 사용하는 사용자 정보 객체를 업데이트하고, 하위 컴포넌트에도 새로운 정보를 전달해주기 위해
  const refreshUser = () => {
      // console.log(authService.currentUser.displayName);
      // Profile.js 에서 refreshUser()를 호출시, 값은 변경되지만, Navigation.js에는 바로 반영이 안되는 것처럼 보임.
      // 그러나, 단순 오브젝트로 값을 변경시에는 바로 변경됨
      // 이유는 리액트 프레임웍이 단순 문자열 변경시에는 문제가 없으나, 복잡한 오브젝트의 값의 변경을 체크하는데에는 문제가 있음
      // 해결방법, 첫번째 오브젝트 크기를 줄여준다.
      // 두번째
      // setUserObj(authService.currentUser);
      // setUserObj({displayName: "BS"});  // 단순 오브젝트

      const user = authService.currentUser;

      // 첫번째 방법
      setUserObj({
          displayName : user.displayName,
          uid: user.uid,
      })

      // 두번째 방법
      // Object.assign(target, source) : 객체를 복사해서 새로운 객체를 만듬
      // target : 보통 빈 객체
      // 객체 복사
      // setUserObj(Object.assign({}, user));

  }

  return (
      <>
          {/* 파이어베이스 초기화 여부에 따라 메뉴 오픈 여부 처리 */}
          {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initialilizing..."}
          {/*<footer>&copy; Nwitter {new Date().getFullYear()}</footer>*/}
      </>

  );
}

export default App;
