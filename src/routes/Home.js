import React, {useEffect, useState, useRef} from "react";
import { v4 as uuidv4 } from "uuid";
import {dbService, storageService} from "firebaseInstance";
import {collection, addDoc, getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
    serverTimestamp} from "firebase/firestore";
import {ref, uploadString, getDownloadURL} from "firebase/storage"; // v9
import Nweet from "components/Nweet";
import NweetFactory from "../components/NweetFactory";  // v9


// export default ()=> <span>Home</span>;
// const Home =  ()=> <span>Home</span>;
/**
 * 트윗 메시지 입력 기능
 * @property userObj : Auth.js　-> Router.js
 * @returns {JSX.Element}
 * @constructor
 */
// NweetFactory.js 에 form 관련된 코드는 모두 옮김
const Home =  ({userObj}) => {
    // console.log(userObj);
    // const [nweet, setNweet] = useState("");  // 트윗 입력 값 스테이트
    const [nweets, setNweets] = useState([]); // 조회된 트윗 데이터 스테이트
    // const [attachment, setAttachment] = useState(null);  // 파일 API　를 통해 읽은 파일 스트링 데이터 스테이트
    // v8
    // const getNweets = async() => {
    //     dbService.collection("nweets".get())
    // }
    // v9, getDocs 이용하여 컬렉션의 도큐먼트 데이터를 가져오는 방식
    // forEach　를 통해 도큐먼트를 한행씩 가져오므로 리렌더링 됨
    // const getNweets = async() => {
    //     const dbNweets = await getDocs(collection(dbService, "nweets"));
    //     // dbNweets : querySnapshot 을 리턴함. 구체적인 데이터는 제공하는 속성, 메소드를 이용하여, 다시 추출해야 함
    //     // forEach 메소드 활용, data 메소드로 document 데이터를 가져온다
    //     // console.log(dbNweets);
    //
    //     dbNweets.forEach(document => {
    //         // console.log(document.data());
    //         // 렌더링하기 편하도록 조회된 데이터를 객체로 만듬
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         }
    //
    //         // 조회된 데이터를 배열형태의 스테이트 변수에 할당함, prev : 현재 보이고있는 트윗
    //         // 스프레드연산자를 이용하여 조회된 데이터, 기존 데이터를 합침
    //         // setNweets((prev) => [document.data(), ...prev]);
    //         // 리엑트에서 스테이트값을 변경시키는 set~함수에는 값만이 아니라, 함수를 이용하여 값을 세팅할 수 있다.
    //         // 함수를 전달할때, 이전값 즉, 현재값, 변경되기 이전 값에 접근이 가능함 : prev
    //
    //         setNweets((prev) => [nweetObject, ...prev]);
    //
    //     });
    // }

    // v8
    // useEffect(()=> {
    //     dbService.collection("nweets".get())
    //
    // }, []);

    /**
     * 리액트 화면 갱신
     */
    useEffect(()=>{
        // getNweets();
        // 파이어스토어에 CRUD 실시간 변화가 일어나면 이벤트 발생
        // v8
        // dbService.collection("nweets").onSnapshot(snapshot => {
        //     console.log("something happend!")
        // })

        // const query = query(collection(dbService, "nweets"),
        //     orderBy("createdAt", "desc"));

        // v9
        // getNweets 함수내의 방식이 아닌, onSnapshot　을 이용하여 도큐먼트 데이터를 가져옴
        // 한번에 데이터를 받아오기 때문에, 리렌더링 발생하지 않음
        onSnapshot(
            query(collection(dbService, "nweets"), /*orderBy("createdAt", "desc")*/),
            (snapshot) => {
                // console.log("something happend!");
                // console.log(snapshot.docs); // 도큐먼트 데이터를 배열형태로 가지고 있음
                const nweetArray = snapshot.docs.map((doc) =>
                    // console.log(doc.data());
                    ({
                        id: doc.id,
                        ...doc.data()
                    })
                );

                // console.log(nweetArray);
                setNweets(nweetArray);
            });

    }, []);

    /**
     * 글 입력 시(submit), 파이어베이스 파이어스토어의 도큐먼트가 생성되는 것임...
     * @param e
     */
    // v8
    // const onSubmit = (e) => {
    //     e.preventDefault();
    //     // 파이어스토어에 콜렉션 생성하는 메소드, v8
    //     dbService.collection("nweets").add({
    //         nweet: nweet,  // 도큐먼트 키, 스테이트 변수와 맞춤
    //         // nweet
    //         createdAt: Date.now(), // 생성날짜
    //     });
    //
    //     setNweet(""); // 트윗작성 후 서브밋하면, 입력 창은 비워둠
    // }
    // v9
    // const onSubmit = async (e) => {
    //     e.preventDefault();
    //     // storage Reference 에서 폴더를 만들 수 있다. 콜렉션과 비슷
    //     // 파일 이름은 중복되지 않도록 랜덤함수 등 이용(직접만들어도 되고, 노드 패키지 사용가능 npm install uuid )
    //     // 파일에 대한 레퍼런스 만듬
    //     // v8
    //     // const attachmentfileRef = storageService.ref().child(`${userObj.uid}/${uuid4()}`);
    //     // format : FileReader 로 읽은 데이터 url?
    //     // const response = await attachmentfileRef.putString(attachment, "data_url");
    //     // console.log(await response.ref.getDownloadURL()) // 다운로드 URL　제공
    //     // const attachmentUrl = await response.ref.getDownloadURL();
    //
    //     let attachmentUrl = "";
    //
    //     // 첨부이미지가 있는 경우만 스토리지 API 호출
    //     // if(attachment !== null) {
    //     //     // v8
    //     //     const attachmentfileRef = storageService.ref().child(`${userObj.uid}/${uuid4()}`);
    //     //     const response = await attachmentfileRef.putString(attachment, "data_url");
    //     //     console.log(await response.ref.getDownloadURL()) // 다운로드 URL　제공
    //     //     const attachmentUrl = await response.ref.getDownloadURL();
    //     //     attachmentUrl = "https://firebasestorage.googleapis.com/v0/b/nwitter-8cd1d.appspot.com/o/ibuni-1.jpg?alt=media&token=1103fa94-af2f-4a7f-af4f-25fa557f956b"
    //     // }
    //
    //     // 이미지 URL　을 포함하여 도큐먼트 생성 객체를 만듬
    //     // const docNweet = {
    //     //     text: nweet,          // 도큐먼트 키, 스테이트 변수와 맞춤
    //     //     createdAt: Date.now(), // 생성날짜
    //     //     creatorId: userObj.uid, // 사용자 인증정보를 props로 받은 값 중, uid
    //     //     attachmentUrl
    //     // }
    //
    //     // v9
    //     try {
    //         // 첨부이미지가 있는 경우만 스토리지 API 호출
    //         if(attachment !== null) {
    //             const attachmentfileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
    //             // const attachmentfileRef = ref(storageService, "images/1");
    //             console.log(attachmentfileRef);
    //             const response = await uploadString(attachmentfileRef, attachment, "data_url");
    //             console.log(response);
    //             attachmentUrl = await getDownloadURL(response.ref);
    //             console.log(attachmentUrl);
    //         }
    //     } catch (error) {
    //         console.log("Error uploadString:", error);
    //     }
    //
    //     // 이미지 URL　을 포함하여 도큐먼트 생성 객체를 만듬
    //     const docNweet = {
    //         text: nweet,          // 도큐먼트 키, 스테이트 변수와 맞춤
    //         createdAt: Date.now(), // 생성날짜
    //         creatorId: userObj.uid, // 사용자 인증정보를 props로 받은 값 중, uid
    //         attachmentUrl
    //     }
    //
    //     // 파이어스토어에 콜렉션 생성하는 메소드, v8
    //     // dbService.collection("nweets").add({
    //     //     nweet: nweet,  // 도큐먼트 키, 스테이트 변수와 맞춤
    //     //     // nweet
    //     //     createdAt: Date.now(), // 생성날짜
    //     // });
    //
    //     // 파이어스토어에 콜렉션 생성하는 메소드, v9
    //     try {
    //       // await addDoc(collection(dbService, "nweets"),
    //       //     {
    //       //         text: nweet,          // 도큐먼트 키, 스테이트 변수와 맞춤
    //       //         createdAt: Date.now(), // 생성날짜
    //       //         creatorId: userObj.uid, // 사용자 인증정보를 props로 받은 값 중, uid
    //       //     })
    //         await addDoc(collection(dbService, "nweets"), docNweet);
    //
    //     } catch (error) {
    //         console.error("Error adding document:", error);
    //     }
    //
    //     setNweet("");       // 트윗작성 후 서브밋하면, 입력 창은 비워둠
    //     setAttachment(null);   // 이미지 관련 스테이트변수 초기화
    //     attachmentFile.current.value = null;  // 　input file　객체를 null　로 만듬
    // }

    // const onChange = (e) => {
    //     const { target : {value}} = e;
    //     // console.log(value);
    //     setNweet(value);
    // }
    // console.log(nweets);

    /**
     * 이미지 프리뷰를 위한 이벤트 처리
     * input file
     * @param e
     */
    // const onFileChange = (e) => {
    //     console.log(e.target.files);
    //     const {
    //       target: {files},
    //     } = e;
    //
    //     const theFile = files[0];
    //     // console.log(theFile);
    //     /**
    //      * {name: 'ibuni-1.jpg', lastModified: 1636950396778, lastModifiedDate: Mon Nov 15 2021 13:26:36 GMT+0900 (일본 표준시), webkitRelativePath: '', size: 8116, …}
    //      */
    //
    //     const reader = new FileReader(); // DOM API
    //
    //     reader.onloadend = (finishedEvent) => {
    //         // console.log(finishedEvent);
    //         /**
    //          * {isTrusted: true, lengthComputable: true, loaded: 8116, total: 8116, type: 'loadend', …}
    //          * // 파일 데이터, 브라우저 주소창에 넣으면 사진이 보임
    //          * data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD...
    //          */
    //         const {
    //             currentTarget: {result},
    //         } = finishedEvent;
    //
    //         // 파일 데이터 스테이트 세팅
    //         setAttachment(result);
    //     };
    //     reader.readAsDataURL(theFile);  //  파일 읽어옴, 완료되면 onloadend 이벤트 발생
    // }
    
    // const onClearAttachment = () => setAttachment(null);

    // const attachmentFile = useRef();  // 리액트 dom 접근 훅, 리액트는 dom 쿼리를 직접 사용하지 않는 것을 권함
    // const onClearAttachment = () => {
    //     setAttachment(null);
    //     attachmentFile.current.value = null;  // 　input file　객체를 null　로 만듬
    // }
    //

    return (
    <div className="container">
        {/* form -> NweetFactory.js */}
        {/*<form onSubmit={onSubmit}>*/}
        {/*    <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>*/}
        {/*    <input onChange={onFileChange} type="file" accept="image/*" ref={attachmentFile}/>*/}
        {/*    <input type="submit" value="Nweet"/>*/}
        {/*    {*/}
        {/*        // 이미지 데이터가 있으면 이미지를 보여줌*/}
        {/*        attachment &&*/}
        {/*           ( <div>*/}
        {/*                <img src={attachment} width="100%" height="auto"/>*/}
        {/*                <button onClick={onClearAttachment}>Clear</button>*/}
        {/*            </div>)*/}
        {/*    }*/}
        {/*</form>*/}
        <NweetFactory userObj={userObj}></NweetFactory>
        <div style={{ marginTop: 30 }}>
            {/*{*/}
            {/*    nweets.map(nweet =>*/}
            {/*        <div key={nweet.id}>*/}
            {/*            <h4>{nweet.text}</h4>*/}
            {/*        </div>*/}
            {/*    )*/}
            {/*}*/}
            {/*Nweet 컴포넌트로 분리함
                props : nweetObj - 데이터베이스 도큐먼트 메시지
                        isOwner - 데이터베이스 도큐먼트 작성자 id, 현재로그인된 사용자 id 일치여부 bool
            */}
            {
                nweets.map(nweet =>
                    <Nweet key={nweet.id}
                           nweetObj={nweet}
                           isOwner={nweet.creatorId === userObj.uid}
                    />
                )
            }
        </div>
    </div>

    )
};
export default Home;