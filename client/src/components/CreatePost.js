import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { TextField, Button, Box, Typography } from "@mui/material";

/**
 * 
 * @returns CreatePost Component, a form to create a post
 * 
 */

function CreatePost() {
    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: "",
        text: "",
        code: ""
    });

    /**
     * @param {*} e event
     * 
     * Function to POST the Post
     * requires post title, text and code
     * As their TextField have "required", it always will send something
     */

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
        if (res.ok) {
            const res_body = await res.json();
            //navigate to the Post page
            navigate("/post/" + res_body.post_id)
        }

    }

    //Functions to handle changes to the TextFields
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

    return (
        <>
            <Typography variant="title">Write Post</Typography>
            <Box component="form" sx={{ width: '80%', maxWidth: 'sm', m: "auto" }} onSubmit={onSubmit}>
                <TextField required
                    margin="normal"
                    fullWidth
                    id="outlined-required"
                    placeholder="Title"
                    type="string"
                    value={post.title}
                    onChange={handleTitleChange}>
                </TextField>
                <TextField required
                    margin="normal"
                    fullWidth
                    multiline
                    rows={4}
                    id="outlined-multiline-static"
                    placeholder="Text"
                    type="string"
                    value={post.text}
                    onChange={handleTextChange}>
                </TextField>
                <TextField required
                    margin="normal"
                    fullWidth
                    multiline
                    rows={10}
                    id="outlined-multiline-static"
                    placeholder="Code snippet"
                    type="string"
                    value={post.code}
                    onChange={handleCodeChange}></TextField>
                <Button variant="contained" className="center-align" type="submit">Post</Button>
            </Box>
        </>
    );
}

export default CreatePost;