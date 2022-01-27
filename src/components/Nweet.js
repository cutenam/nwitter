import React, {useState} from "react";
import {dbService, storageService} from "firebaseInstance";
import {collection, addDoc, getDocs,
    doc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    orderBy,
    query,
    where,
    serverTimestamp} from "firebase/firestore";
import {ref, deleteObject} from "firebase/storage"; // v9
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {
    // 수정 모드 알려주는 스테이트변수
    const [editing, setEditing] = useState(false);
    // 수정할 메시지 스테이트변수, 디폴트 : 현재 메시지 텍스트
    // 입력된 메시지를 업데이트해줌 : 스테이트변수의 역할
    const [newNweet, setNewNweet] = useState(nweetObj.text);


    // 트윗 삭제 함수
    // 해당 메시지의 도큐먼트 id (nweetObj.id)를 이용하여 삭제함
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure want to delete this nweet?");
        // console.log(ok);

       // v8
       //  if(ok){
       //      //delete
       //      await dbService.doc(`nweets/${nweetObj.id}`).delete();  // 도큐먼트 삭제
       //      await storageService.refFromURL(nweetObj.attachmentUrl).delete();  // 파일스토리지 파일 삭제
       //  }

        // v9
        const nweetDocRef = doc(dbService, "nweets", `${nweetObj.id}`);
        // console.log(nweetDocRef);

        if(ok) {
           await deleteDoc(nweetDocRef);
           // 첨부파일이 있는 경우만 파이어스토리지 deleteObject 호출
           nweetObj.attachmentUrl && await deleteObject(ref(storageService, nweetObj.attachmentUrl));
        }
    }

    const toggleEditing = () => setEditing((prev) => !prev);

    const onChange = (e) => {
        const {
            target: {value},
        } = e;
        // 스테이트 변수에 입력 태그의 속성과 연결시켜줘야, 입력이 가능함 (리액트 화면 갱신 프로세스)
        setNewNweet(value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        // console.log(nweetObj, newNweet);

        // v8
        // await dbService.doc(`nweets/${nweetObj.id}`).update({
        //     text: newNweet,
        // });

        // v9
        // const nweetDocRef = doc(dbService, "nweets", `${nweetObj.id}`);
        // console.log(nweetDocRef);
        // await updateDoc(nweetDocRef, {
        //     text: newNweet,
        // });
        await updateDoc(doc(dbService, `nweets/${nweetObj.id}`), {
            text: newNweet,
        });

        // 수정모드 원복
        setEditing(false);

    };

   return (
       <div className="nweet">
           {
               // 수정 버튼 true/false 에 따라, 입력폼 또는 메시지조회 화면 보여줌
               editing ?
                   (<>
                       <form onSubmit={onSubmit} className="container nweetEdit">
                           <input className="formInput" onChange={onChange} type="text" placeholder="Edit your nweet" value={newNweet} required autoFocus />
                           <input className="formBtn" type="submit" value="Update Nweet"/>
                       </form>

                       {/*<button onClick={toggleEditing}>Cancel</button>*/}
                       <span onClick={toggleEditing} className="formBtn cancelBtn">
                         Cancel
                       </span>
                   </>)
                   :
                   (<>
                       <h4>{nweetObj.text}</h4>
                       {
                           nweetObj.attachmentUrl &&
                           // <img src={nweetObj.attachmentUrl} width="50px" height="50px"/>
                           <img src={nweetObj.attachmentUrl}/>
                       }
                       {
                           // 본인이 작성한 트윗에서만 삭제, 수정 버튼이 보이도록함
                           isOwner &&
                           // <>
                           // <button onClick={onDeleteClick}>Delete Nweet</button>
                           // <button onClick={toggleEditing}>Edit Nweet</button>
                           // </>
                           (<div className="nweet__actions">
                               <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                               </span>
                               <span onClick={toggleEditing}>
                                 <FontAwesomeIcon icon={faPencilAlt} />
                               </span>
                           </div>)
                       }
                   </>)
           }
        </div>
   );
};

export default Nweet;