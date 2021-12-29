// import logo from './logo.svg';
// import './App.css';
import React, {useState} from "react";
// import AppRouter from "./Router";
// import firebase from "../firebase";  // firebase.js 를 상대경로로 임포트, 절대경로로 임포트하기 위해서 jsconfig.json　파일에 루트 디렉토리를 설정해주면 가능함
import AppRouter from "components/Router";
// import firebase from "firebaseInstance";
import {firebaseApp, authService} from "firebaseInstance";
// import authService from "firebaseInstance";


// App.js　에서 어플리케이션의 모든 로직을 핸들링하도록 구조를 잡을거라 함
function App() {

  // const auth = fbase.auth();
  const auth = authService;
  // 유저를 가져와서 로그인 여부를 판단하도록 하는 것!
  console.log(auth.currentUser);
  const authCurrentUser = auth.currentUser;

  // 로그인 여부 스테이트 -> Router.js에 props로 전달함
  const [isLoggedIn, setIsLoggedIn] = useState(authCurrentUser);


  return (
      <>
   <AppRouter isLoggedIn={isLoggedIn} />
   {/*<footer>&copy; Nwitter {new Date().getFullYear()}</footer>*/}
      </>

  );
}

export default App;
