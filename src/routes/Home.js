import React, {useEffect, useState} from "react";
import {dbService} from "firebaseInstance";
import {collection, addDoc, getDocs, serverTimestamp} from "firebase/firestore";  // v9

// export default ()=> <span>Home</span>;
// const Home =  ()=> <span>Home</span>;
/**
 * 트윗 메시지 입력 기능
 * @returns {JSX.Element}
 * @constructor
 */
const Home =  () => {

    const [nweet, setNweet] = useState("");  // 트윗 입력 값 스테이트
    const [nweets, setNweets] = useState([]); // 조회된 트윗 데이터 스테이트
    // const getNweets = async() => {
    //     dbService.collection("nweets".get())
    // }
    const getNweets = async() => {
        const dbNweets = await getDocs(collection(dbService, "nweets"));
        // dbNweets : querySnapshot 을 리턴함. 구체적인 데이터는 제공하는 속성, 메소드를 이용하여, 다시 추출해야 함
        // forEach 메소드 활용, data 메소드로 document 데이터를 가져온다
        // console.log(dbNweets);
        dbNweets.forEach(document => {
            // console.log(document.data());
            // 렌더링하기 편하도록 조회된 데이터를 객체로 만듬
            const nweetObject = {
                ...document.data(),
                id: document.id,
            }

            // 조회된 데이터를 배열형태의 스테이트 변수에 할당함, prev : 현재 보이고있는 트윗
            // 스프레드연산자를 이용하여 조회된 데이터, 기존 데이터를 합침
            // setNweets((prev) => [document.data(), ...prev]);
            // 리엑트에서 스테이트값을 변경시키는 set~함수에는 값만이 아니라, 함수를 이용하여 값을 세팅할 수 있다.
            // 함수를 전달할때, 이전값 즉, 현재값, 변경되기 이전 값에 접근이 가능함 : prev

            setNweets((prev) => [nweetObject, ...prev]);

        });
    }

    // useEffect(()=> {
    //     dbService.collection("nweets".get())
    //
    // }, []);

    useEffect(()=>{
        getNweets();
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
                  nweet:nweet,          // 도큐먼트 키, 스테이트 변수와 맞춤
                  createdAt: Date.now() // 생성날짜
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
    console.log(nweets);

    return (
    <div>
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
            <input type="submit" value="Nweet"/>
        </form>
        <div>
            {
                nweets.map(nweet =>
                    <div key={nweet.id}>
                        <h4>{nweet.nweet}</h4>
                    </div>
                )
            }
        </div>
    </div>

    )
};
export default Home;