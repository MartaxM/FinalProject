import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

function AddComment(props) {
    const [comment, setComment] = useState({ text: "" });
    let post_id = props.post_id;

    function handleTextChange(e) {
        setComment({
            ...comment,
            text: e.target.value
        });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: comment.text
            }),
            mode: "cors"
        }
        const res = await fetch('/api/post/' + post_id + '/comment/create', requestOptions).catch((err) => console.log(err))

        if (res.ok) {
            window.location.reload(true)
        }
    }

    return (
        <Box component="form" sx={{ width: '80%', maxWidth: 'sm', m: "auto", mt: 2 }} onSubmit={onSubmit}>
            <TextField
                fullWidth
                required
                margin="normal"
                multiline
                id="outlined-multiline-static"
                rows={4}
                placeholder="Your comment here"
                type="string" value={comment.text}
                onChange={handleTextChange}>
            </TextField>
            <Button type="submit" variant="contained" className="center-align">Comment</Button>
        </Box>
    );
}

export default AddComment;