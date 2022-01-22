import React, {useEffect, useState} from "react";
import {dbService} from "firebaseInstance";
import {collection, addDoc, getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
    serverTimestamp} from "firebase/firestore";
import Nweet from "components/Nweet";  // v9

// export default ()=> <span>Home</span>;
// const Home =  ()=> <span>Home</span>;
/**
 * 트윗 메시지 입력 기능
 * @property userObj : Auth.js　-> Router.js
 * @returns {JSX.Element}
 * @constructor
 */
const Home =  ({userObj}) => {
    // console.log(userObj);
    const [nweet, setNweet] = useState("");  // 트윗 입력 값 스테이트
    const [nweets, setNweets] = useState([]); // 조회된 트윗 데이터 스테이트
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
    const onSubmit = async (e) => {
        e.preventDefault();
        // 파이어스토어에 콜렉션 생성하는 메소드, v8
        // dbService.collection("nweets").add({
        //     nweet: nweet,  // 도큐먼트 키, 스테이트 변수와 맞춤
        //     // nweet
        //     createdAt: Date.now(), // 생성날짜
        // });

        // 파이어스토어에 콜렉션 생성하는 메소드, v9
        try {
          await addDoc(collection(dbService, "nweets"),
              {
                  text: nweet,          // 도큐먼트 키, 스테이트 변수와 맞춤
                  createdAt: Date.now(), // 생성날짜
                  creatorId: userObj.uid, // 사용자 인증정보를 props로 받은 값 중, uid
              })
        } catch (error) {
            console.error("Error adding document:", error);
        }

        setNweet(""); // 트윗작성 후 서브밋하면, 입력 창은 비워둠
    }

    const onChange = (e) => {
        const { target : {value}} = e;
        // console.log(value);
        setNweet(value);
    }
    // console.log(nweets);

    return (
    <div>
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
            <input type="submit" value="Nweet"/>
        </form>
        <div>
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