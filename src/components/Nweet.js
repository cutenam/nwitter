import React from "react";

const Nweet = ({nweetObj, isOwner}) => (
    <div>
        <h4>{nweetObj.text}</h4>
        {
            // 본인이 작성한 트윗에서만 삭제, 수정 버튼이 보이도록함
            isOwner &&
            <>
                <button>Delete Nweet</button>
                <button>Edit Nweet</button>
            </>
        }
    </div>
);

export default Nweet;