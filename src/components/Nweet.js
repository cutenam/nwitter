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
        console.log(ok);

       // v8
       //  if(ok){
       //      //delete
       //      await dbService.doc(`nweets/${nweetObj.id}`).delete();
       //  }

        // v9
        const nweetDocRef = doc(dbService, "nweets", `${nweetObj.id}`);
        // console.log(nweetDocRef);

        if(ok) {
           await deleteDoc(nweetDocRef);
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
       <div>
           {
               // 수정 버튼 true/false 에 따라, 입력폼 또는 메시지조회 화면 보여줌
               editing ?
                   (<>
                       <form onSubmit={onSubmit}>
                           <input onChange={onChange} type="text" placeholder="Edit your nweet" value={newNweet} required/>
                           <input type="submit" value="Update Nweet"/>
                       </form>

                       <button onClick={toggleEditing}>Cancel</button>
                   </>)
                   :
                   (<>
                       <h4>{nweetObj.text}</h4>
                       {
                           nweetObj.attachmentUrl &&
                           <img src={nweetObj.attachmentUrl} width="50px" height="50px"/>
                       }
                       {
                           // 본인이 작성한 트윗에서만 삭제, 수정 버튼이 보이도록함
                           isOwner &&
                           <>
                           <button onClick={onDeleteClick}>Delete Nweet</button>
                           <button onClick={toggleEditing}>Edit Nweet</button>
                           </>
                       }
                   </>)
           }
        </div>
   );
};

export default Nweet;