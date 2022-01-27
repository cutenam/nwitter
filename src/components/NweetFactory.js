import React, {useState, useRef} from "react";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {dbService, storageService} from "firebaseInstance";
import {v4 as uuidv4} from "uuid";
import {addDoc, collection} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

/**
 * 트윗 메시지작성, 파일첨부 기능
 * Home.js 에서 리팩토리~~
 * @param userObj
 * @returns {JSX.Element}
 * @constructor
 */
const NweetFactory = ({userObj}) => {

    const [nweet, setNweet] = useState("");  // 트윗 입력 값 스테이트
    const [attachment, setAttachment] = useState(null);  // 파일 API　를 통해 읽은 파일 스트링 데이터 스테이트

    const onSubmit = async (e) => {
        // 스타일링 부분에서 추가됨...
        if (nweet === "") {
            return;
        }

        e.preventDefault();
        // storage Reference 에서 폴더를 만들 수 있다. 콜렉션과 비슷
        // 파일 이름은 중복되지 않도록 랜덤함수 등 이용(직접만들어도 되고, 노드 패키지 사용가능 npm install uuid )
        // 파일에 대한 레퍼런스 만듬
        // v8
        // const attachmentfileRef = storageService.ref().child(`${userObj.uid}/${uuid4()}`);
        // format : FileReader 로 읽은 데이터 url?
        // const response = await attachmentfileRef.putString(attachment, "data_url");
        // console.log(await response.ref.getDownloadURL()) // 다운로드 URL　제공
        // const attachmentUrl = await response.ref.getDownloadURL();

        let attachmentUrl = "";

        // 첨부이미지가 있는 경우만 스토리지 API 호출
        // if(attachment !== null) {
        //     // v8
        //     const attachmentfileRef = storageService.ref().child(`${userObj.uid}/${uuid4()}`);
        //     const response = await attachmentfileRef.putString(attachment, "data_url");
        //     console.log(await response.ref.getDownloadURL()) // 다운로드 URL　제공
        //     const attachmentUrl = await response.ref.getDownloadURL();
        //     attachmentUrl = "https://firebasestorage.googleapis.com/v0/b/nwitter-8cd1d.appspot.com/o/ibuni-1.jpg?alt=media&token=1103fa94-af2f-4a7f-af4f-25fa557f956b"
        // }

        // 이미지 URL　을 포함하여 도큐먼트 생성 객체를 만듬
        // const docNweet = {
        //     text: nweet,          // 도큐먼트 키, 스테이트 변수와 맞춤
        //     createdAt: Date.now(), // 생성날짜
        //     creatorId: userObj.uid, // 사용자 인증정보를 props로 받은 값 중, uid
        //     attachmentUrl
        // }

        // v9
        try {
            // 첨부이미지가 있는 경우만 스토리지 API 호출
            if(attachment !== null) {
                const attachmentfileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
                // const attachmentfileRef = ref(storageService, "images/1");
                console.log(attachmentfileRef);
                const response = await uploadString(attachmentfileRef, attachment, "data_url");
                console.log(response);
                attachmentUrl = await getDownloadURL(response.ref);
                console.log(attachmentUrl);
            }
        } catch (error) {
            console.log("Error uploadString:", error);
        }

        // 이미지 URL　을 포함하여 도큐먼트 생성 객체를 만듬
        const docNweet = {
            text: nweet,          // 도큐먼트 키, 스테이트 변수와 맞춤
            createdAt: Date.now(), // 생성날짜
            creatorId: userObj.uid, // 사용자 인증정보를 props로 받은 값 중, uid
            attachmentUrl
        }

        // 파이어스토어에 콜렉션 생성하는 메소드, v8
        // dbService.collection("nweets").add({
        //     nweet: nweet,  // 도큐먼트 키, 스테이트 변수와 맞춤
        //     // nweet
        //     createdAt: Date.now(), // 생성날짜
        // });

        // 파이어스토어에 콜렉션 생성하는 메소드, v9
        try {
            // await addDoc(collection(dbService, "nweets"),
            //     {
            //         text: nweet,          // 도큐먼트 키, 스테이트 변수와 맞춤
            //         createdAt: Date.now(), // 생성날짜
            //         creatorId: userObj.uid, // 사용자 인증정보를 props로 받은 값 중, uid
            //     })
            await addDoc(collection(dbService, "nweets"), docNweet);

        } catch (error) {
            console.error("Error adding document:", error);
        }

        setNweet("");       // 트윗작성 후 서브밋하면, 입력 창은 비워둠
        setAttachment(null);   // 이미지 관련 스테이트변수 초기화
        attachmentFile.current.value = null;  // 　input file　객체를 null　로 만듬
    }

    const onChange = (e) => {
        const { target : {value}} = e;
        // console.log(value);
        setNweet(value);
    }

    const onFileChange = (e) => {
        console.log(e.target.files);
        const {
            target: {files},
        } = e;

        const theFile = files[0];
        // console.log(theFile);
        /**
         * {name: 'ibuni-1.jpg', lastModified: 1636950396778, lastModifiedDate: Mon Nov 15 2021 13:26:36 GMT+0900 (일본 표준시), webkitRelativePath: '', size: 8116, …}
         */

        const reader = new FileReader(); // DOM API

        reader.onloadend = (finishedEvent) => {
            // console.log(finishedEvent);
            /**
             * {isTrusted: true, lengthComputable: true, loaded: 8116, total: 8116, type: 'loadend', …}
             * // 파일 데이터, 브라우저 주소창에 넣으면 사진이 보임
             * data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD...
             */
            const {
                currentTarget: {result},
            } = finishedEvent;

            // 파일 데이터 스테이트 세팅
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);  //  파일 읽어옴, 완료되면 onloadend 이벤트 발생
    }

    const attachmentFile = useRef();  // 리액트 dom 접근 훅, 리액트는 dom 쿼리를 직접 사용하지 않는 것을 권함
    const onClearAttachment = () => {
        setAttachment(null);
        attachmentFile.current.value = null;  // 　input file　객체를 null　로 만듬
    }

    return(
        <form onSubmit={onSubmit} className="factoryForm">
            {/*<input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>*/}
            {/*<input onChange={onFileChange} type="file" accept="image/*" ref={attachmentFile}/>*/}
            {/*<input type="submit" value="Nweet"/>*/}
            {/*{*/}
            {/*    // 이미지 데이터가 있으면 이미지를 보여줌*/}
            {/*    attachment &&*/}
            {/*    ( <div>*/}
            {/*        <img src={attachment} width="100%" height="auto"/>*/}
            {/*        <button onClick={onClearAttachment}>Clear</button>*/}
            {/*    </div>)*/}
            {/*}*/}

            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input id="attach-file"
                   type="file"
                   accept="image/*"
                   onChange={onFileChange}
                   style={{
                       opacity: 0,
                   }}
                   ref={attachmentFile}
            />
            {
                attachment && (
                <div className="factoryForm__attachment">
                    <img src={attachment} />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>)
            }
        </form>
    );
};

export default NweetFactory;