import { useState } from "react";

function AddComment(props) {
    const [comment, setComment] = useState({ text: "" });
    let post_id = props.post_id;

    function handleTextChange(e) {
        setComment({
            ...comment,
            text: e.target.value
        });
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: comment.text
            }),
            mode: "cors"
        }
        await fetch('/api/post/'+post_id+'/comment/create', requestOptions).catch((err)=>console.log(err))
        
        // if(res.ok){
        //     const res_body = await res.json();
        //     navigate("/post/" + res_body.post_id)
        // }
    }


    return (
        <div>
            <form onSubmit={onSubmit}>
                <input placeholder="Your comment here" type="string" value={comment.text} onChange={handleTextChange}></input>
                <button type="submit" onClick={() => window.location.reload(true)}>Comment</button>
            </form>
        </div>
    );
}

export default AddComment;