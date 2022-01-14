import React, {useState} from "react";

/**
 * 로그인 인증 처리
 * @returns {JSX.Element}
 * @constructor
 */

// export default ()=> <span>Auth</span>;
// const 로 모듈을 정의해두면, 다른 곳에서 자동 임포트 구문 삽입이 가능하다
const Auth = ()=>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const onChange = (e) =>{
        console.log(e.target.name);

        // 이벤트가 발생할 때, 폼태그 이름을 가져와서 구분하여 값을 별도로 처리함
        const {target: {name, value}} = e;

        if (name === "email") {
            setEmail(value);
        } else if (name === "password")  {
            setPassword(value);
        }
    };
    const onSubmit = (e) => {
      e.preventDefault();
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} name="email" type="text" placeholder="Email" required value={email} />
                <input onChange={onChange} name="password" type="password" placeholder="Password" required value={password}/>
                <input type="submit" value="Log In" required />
            </form>
            <div>
                <button>Continue with Google</button>
                <button>Continue with Github</button>
            </div>
        </div>
    )
}


export default Auth;