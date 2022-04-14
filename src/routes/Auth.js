import React, {useState} from "react";
// import {firebaseApp, authService} from "../firebaseInstance";
import { getAuth,
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    GithubAuthProvider, GoogleAuthProvider,
    signInWithPopup } from "firebase/auth";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faGoogle,
    faGithub,
} from "@fortawesome/free-brands-svg-icons";


/**
 * 로그인 인증 처리
 * @returns {JSX.Element}
 * @constructor
 */

// AuthForm.js 로 리팩토링, form 관련 기능

// export default ()=> <span>Auth</span>;
// const 로 모듈을 정의해두면, 다른 곳에서 자동 임포트 구문 삽입이 가능하다
const Auth = ()=>{
    const fbAuth = getAuth();
    // hook,,,
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // 파이어베이스 인증 결과 값에 따라, 로그인 또는 계정만들기 버튼을 보여줄 스테이트
    // const [newAccount, setNewAccount] = useState(true);
    // const [error, setError] = useState("");

    // const onChange = (e) =>{
    //     // console.log(e.target.name);
    //
    //     // 이벤트가 발생할 때, 폼태그 이름을 가져와서 구분하여 값을 별도로 처리함
    //     // 훅
    //     const {
    //         target: {name, value}
    //     } = e;
    //
    //     // console.log(name);
    //     // console.log(value)
    //     // input value 속성에 스테이트 변수를 지정하여, 입력된 값이 스테이트 변수에 반영되도록 함
    //     if (name === "email") {
    //         setEmail(value);
    //     } else if (name === "password")  {
    //         setPassword(value);
    //     }
    // };

    /**
     * 로그인 또는 계정생성인지 스테이트변수 newAccount 로 구분하여,
     * 해당하는 파이어베이스 인증 API 구분하여 호출함
     * @param e
     * @returns {Promise<void>}
     */
    // const onSubmit = (e) => {
    // const onSubmit = async (e) => {
    //   e.preventDefault();  // submit 버튼을 호출 시, 페이지 새로고침되는걸 막기 위해서, 기본 이벤트를 막는다
    //   let data;
    //   try {
    //       if (newAccount) {
    //           // 새로운 계정 생성, 자동로그인도 해줌
    //           // 파이어베이스 authService의 API　사용, email, password값 넘겨줌
    //           // async await :  promise 비동기 응답
    //           data = await createUserWithEmailAndPassword(fbAuth, email, password);
    //       } else {
    //           // 인증프로세스
    //           data = await signInWithEmailAndPassword(fbAuth, email, password);
    //       }
    //       console.log(data);
    //       /**
    //        * // UserCredentialImpl
    //        * {
    //        *     "user": {
    //        *         "uid": "zQWw4nOxIMTQwivaKRrqOP7vcmY2",
    //        *         "email": "abc@abc.com",
    //        *         "emailVerified": false,
    //        *         "isAnonymous": false,
    //        *         "providerData": [
    //        *             {
    //        *                 "providerId": "password",
    //        *                 "uid": "abc@abc.com",
    //        *                 "displayName": null,
    //        *                 "email": "abc@abc.com",
    //        *                 "phoneNumber": null,
    //        *                 "photoURL": null
    //        *             }
    //        *         ],
    //        *         "stsTokenManager": {
    //        *             "refreshToken": "AFxQ4_qAt7scDpHPOz8eXBMBaJqVAlsJniIFPcE59TpZQnjBi_rp9stGDzDBGmX10NPi6WAtRBrnJVli9p-3pj8WawC6J8K0SqboKlPGpzGk-k-FZt9qzYgJ9tO1WS3uba5wX8YvysbsmYmciWnlQqsc9IzoRRYjKtKbfAxqMBM0XavnyWJ1Gqp6RoxfHxhpeL7BSvFWTCfV",
    //        *             "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM1MDZmMzc1MjI0N2ZjZjk0Y2JlNWQyZDZiNTlmYThhMmJhYjFlYzIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbndpdHRlci04Y2QxZCIsImF1ZCI6Im53aXR0ZXItOGNkMWQiLCJhdXRoX3RpbWUiOjE2NDIxNDU0NzIsInVzZXJfaWQiOiJ6UVd3NG5PeElNVFF3aXZhS1JycU9QN3ZjbVkyIiwic3ViIjoielFXdzRuT3hJTVRRd2l2YUtScnFPUDd2Y21ZMiIsImlhdCI6MTY0MjE0NTQ3MiwiZXhwIjoxNjQyMTQ5MDcyLCJlbWFpbCI6ImFiY0BhYmMuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiY0BhYmMuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.j791EQCj9QMCWgQ1ho_J1DxkwiGxZtMvFqz9cziKVngZX0nHU5jnK2EMadaJDm7Ft7TsjpXERffp_pPPOSkZWzTlRGWBb4dXezAQosaJGY0dSNrglf9rrreQCAabeVuP0f0QdKPhinwaM5Yuvy-edOK8j7IPsdv13t5XgvAQ7XKSocLVp7u3EYNgK_9OwO8bkFJpEhiiafnWQBW0Wrp04RztJgq8UomQj2qKnHI9_gM-vZRfrFliBKpdE-uI45VqFxXCh6TD-Kpz7Xxm3aBnXyc84_0YsxNSEowuXPuSW0fKzHrioaC0bUPPIVzzW0mOnLnoxB53JAw5w_OICOfxLg",
    //        *             "expirationTime": 1642149072108
    //        *         },
    //        *         "createdAt": "1642145471680",
    //        *         "lastLoginAt": "1642145471680",
    //        *         "apiKey": "AIzaSyAwn5YaKK2sKQltCLVwN7ExSLXKCSFBGUU",
    //        *         "appName": "[DEFAULT]"
    //        *     },
    //        *     "providerId": null,
    //        *     "_tokenResponse": {
    //        *         "kind": "identitytoolkit#SignupNewUserResponse",
    //        *         "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM1MDZmMzc1MjI0N2ZjZjk0Y2JlNWQyZDZiNTlmYThhMmJhYjFlYzIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbndpdHRlci04Y2QxZCIsImF1ZCI6Im53aXR0ZXItOGNkMWQiLCJhdXRoX3RpbWUiOjE2NDIxNDU0NzIsInVzZXJfaWQiOiJ6UVd3NG5PeElNVFF3aXZhS1JycU9QN3ZjbVkyIiwic3ViIjoielFXdzRuT3hJTVRRd2l2YUtScnFPUDd2Y21ZMiIsImlhdCI6MTY0MjE0NTQ3MiwiZXhwIjoxNjQyMTQ5MDcyLCJlbWFpbCI6ImFiY0BhYmMuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiY0BhYmMuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.j791EQCj9QMCWgQ1ho_J1DxkwiGxZtMvFqz9cziKVngZX0nHU5jnK2EMadaJDm7Ft7TsjpXERffp_pPPOSkZWzTlRGWBb4dXezAQosaJGY0dSNrglf9rrreQCAabeVuP0f0QdKPhinwaM5Yuvy-edOK8j7IPsdv13t5XgvAQ7XKSocLVp7u3EYNgK_9OwO8bkFJpEhiiafnWQBW0Wrp04RztJgq8UomQj2qKnHI9_gM-vZRfrFliBKpdE-uI45VqFxXCh6TD-Kpz7Xxm3aBnXyc84_0YsxNSEowuXPuSW0fKzHrioaC0bUPPIVzzW0mOnLnoxB53JAw5w_OICOfxLg",
    //        *         "email": "abc@abc.com",
    //        *         "refreshToken": "AFxQ4_qAt7scDpHPOz8eXBMBaJqVAlsJniIFPcE59TpZQnjBi_rp9stGDzDBGmX10NPi6WAtRBrnJVli9p-3pj8WawC6J8K0SqboKlPGpzGk-k-FZt9qzYgJ9tO1WS3uba5wX8YvysbsmYmciWnlQqsc9IzoRRYjKtKbfAxqMBM0XavnyWJ1Gqp6RoxfHxhpeL7BSvFWTCfV",
    //        *         "expiresIn": "3600",
    //        *         "localId": "zQWw4nOxIMTQwivaKRrqOP7vcmY2"
    //        *     },
    //        *     "operationType": "signIn"
    //        * }
    //        */
    //   } catch (error) {
    //       /**
    //        * 중복된 메일계정의 사용자를 만든 경우,,, 익셉션에러 발생함...
    //        * index.ts:113 POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAwn5YaKK2sKQltCLVwN7ExSLXKCSFBGUU 400
    //        * (anonymous) @ index.ts:113
    //        * await in (anonymous) (async)
    //        * _performFetchWithErrorHandling @ index.ts:134
    //        * _performApiRequest @ index.ts:88
    //        * _performSignInRequest @ index.ts:188
    //        * signUp @ sign_up.ts:43
    //        * createUserWithEmailAndPassword @ email_and_password.ts:230
    //        * onSubmit @ Auth.js:49
    //        * callCallback @ react-dom.development.js:3945
    //        * invokeGuardedCallbackDev @ react-dom.development.js:3994
    //        * invokeGuardedCallback @ react-dom.development.js:4056
    //        * invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:4070
    //        * executeDispatch @ react-dom.development.js:8243
    //        * processDispatchQueueItemsInOrder @ react-dom.development.js:8275
    //        * processDispatchQueue @ react-dom.development.js:8288
    //        * dispatchEventsForPlugins @ react-dom.development.js:8299
    //        * (anonymous) @ react-dom.development.js:8508
    //        * batchedEventUpdates$1 @ react-dom.development.js:22396
    //        * batchedEventUpdates @ react-dom.development.js:3745
    //        * dispatchEventForPluginEventSystem @ react-dom.development.js:8507
    //        * attemptToDispatchEvent @ react-dom.development.js:6005
    //        * dispatchEvent @ react-dom.development.js:5924
    //        * unstable_runWithPriority @ scheduler.development.js:468
    //        * runWithPriority$1 @ react-dom.development.js:11276
    //        * discreteUpdates$1 @ react-dom.development.js:22413
    //        * discreteUpdates @ react-dom.development.js:3756
    //        * dispatchDiscreteEvent @ react-dom.development.js:5889
    //        * Auth.js:96 FirebaseError: Firebase: Error (auth/email-already-in-use).
    //        *     at createErrorInternal (assert.ts:122:1)
    //        *     at _createError (assert.ts:83:1)
    //        *     at _makeTaggedError (index.ts:258:1)
    //        *     at _performFetchWithErrorHandling (index.ts:160:1)
    //        *     at async _performSignInRequest (index.ts:188:1)
    //        *     at async createUserWithEmailAndPassword (email_and_password.ts:230:1)
    //        *     at async onSubmit (Auth.js:49:1)
    //        */
    //       console.log(error.message);
    //       setError(error.message);
    //   }
    // };

    // const toggleAccount = () => setNewAccount((prev) => !prev);
    /**
     * 구글, 깃허브 계정으로 인증(소셜로그인)
     * 파이어베이스 모듈을 통하여, 인증 팝업을 통하여 인증
     * @param e
     * @returns {Promise<void>}
     */
    const onSocialClick = async (e) => {
        // console.log(e.target.name);
        const {
            target: {name},
        } = e;

        let provider;

        if (name === "google") {
            // provider = new firebaseApp.auth.GoogleAuthProvider(); // 파이어베이스 8.0
            provider = new GoogleAuthProvider();    // 파이어베이스 9.0
        } else {
            // provider = new firebaseApp.auth.GithubAuthProvider();
            provider = new GithubAuthProvider();
        }

        const data = await signInWithPopup(fbAuth, provider);

        // console.log("onSocialClick: "+name);
        console.log("Auth.js onSocialClick: ", data);

    }

    return (
        <div className="authContainer">
            <FontAwesomeIcon
                icon={faTwitter}
                color={"#04AAFF"}
                size="3x"
                style={{ marginBottom: 30 }}
            />
            {/* form 영역 AuthForm.js 로 리팩토링 */}
            {/*<form onSubmit={onSubmit}>*/}
            {/*    <input onChange={onChange} name="email" type="email" placeholder="Email" required value={email} />*/}
            {/*    <input onChange={onChange} name="password" type="password" placeholder="Password" required value={password}/>*/}
            {/*    /!*<input type="submit" value="Log In" />*!/*/}
            {/*    /!* 계정이 없는 경우 새로 만들도록 함 *!/*/}
            {/*    <input type="submit" value={ newAccount ? "Create Account" : "Sign in"} />*/}
            {/*    {error}*/}
            {/*</form>*/}
            {/*<span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account"}</span>*/}
            <AuthForm></AuthForm>
            <div className="authBtns">
                <button className="authBtn" onClick={onSocialClick} name="google">Continue with Google <FontAwesomeIcon icon={faGoogle} /></button>
                <button className="authBtn" onClick={onSocialClick} name="github">Continue with Github <FontAwesomeIcon icon={faGithub} /></button>
            </div>
        </div>
    )
}


export default Auth;