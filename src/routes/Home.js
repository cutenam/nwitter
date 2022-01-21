import React, {useState} from "react";

// export default ()=> <span>Home</span>;
// const Home =  ()=> <span>Home</span>;
/**
 * 트윗 메시지 입력 기능
 * @returns {JSX.Element}
 * @constructor
 */
const Home =  () => {

    const [nweet, setNweet] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
    }
    
    const onChange = (e) => {
        const { target : {value}} = e;
        // console.log(value);
        setNweet(value);
    }

    return (
    <div>
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
            <input type="submit" value="Nweet"/>
        </form>
    </div>
    )
};
export default Home;