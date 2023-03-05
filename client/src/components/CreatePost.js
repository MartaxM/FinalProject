import { useState } from "react";
import { useNavigate } from "react-router-dom"

function CreatePost() {
    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: "",
        text: "",
        code: ""
    });

    function handleTitleChange(e) {
        setPost({
            ...post,
            title: e.target.value
        });
    }

    function handleTextChange(e) {
        setPost({
            ...post,
            text: e.target.value
        });
    }

    function handleCodeChange(e) {
        setPost({
            ...post,
            code: e.target.value
        });
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: post.title,
                text: post.text,
                code: post.code,
            }),
            mode: "cors"
        }
        let res = await fetch('/api/post/create', requestOptions)
        if(res.ok){
            const res_body = await res.json();
            navigate("/post/" + res_body.post_id)
        }
       
    }


    return (
        <div>
            <form onSubmit={onSubmit}>
                <input placeholder="Title" type="string" value={post.title} onChange={handleTitleChange}></input>
                <input placeholder="Text" type="string" value={post.text} onChange={handleTextChange}></input>
                <input placeholder="Code snippet" type="string" value={post.code} onChange={handleCodeChange}></input>
                <button type="submit">Post</button>
            </form>
        </div>
    );
}

export default CreatePost;