// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // v9, Cloud Firebase 모듈
import { getStorage } from "firebase/storage"; // v9, Firebase Storage 모듈

// Your web app's Firebase configuration
const firebaseConfig = {
    // .env 파일을 생성하여, 파이어베이스 앱정보를 넣어주고, process 객체 읽어들임
    // 리액트(npx create-react-app 명령어를 사용할때)에서 환경변수 파일을 생성하는 경우 변수명은 "REACT_APP_"로 시작해줘야한다고 함
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const dbService = getFirestore();
const storageService = getStorage();


export {firebaseApp, dbService, storageService};