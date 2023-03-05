import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddComment from "./AddComment";
import Comment from "./Comment";
import Button from '@mui/material/Button'
import { Typography, Box } from "@mui/material";
import { grey } from "@mui/material/colors";


function PostDetails() {

    const [post, setPost] = useState(null);
    let { post_id } = useParams();
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        let mounted = true;
        const requestOptions = {
            method: 'GET',
            mode: "cors"
        }
        async function fetchLoggingState() {
            let res = await fetch("/api/user/logged_in", requestOptions)
                .catch((e) => {
                    console.log(e);
                })
            if (mounted) {
                console.log(res.ok)
                setLogged(res.ok)
            }
        }

        fetchLoggingState();
        return () => { mounted = false; };
    }, [])

    useEffect(() => {
        let mounted = true;
        async function fetchPost() {
            let res = await fetch("/api/post/" + (post_id) + "/details")
                .then(response => response.json())
                .catch((e) => {
                    console.log(e);
                })
            if (mounted) {

                let post_info =
                    <Box style={{ textAlign: "left" }} sx={{ margin: "auto", width: '85%' }}>
                        <Typography variant="title" padding={2}>{res.title}</Typography>
                        <Typography variant="by_user_tag">&emsp;by <span style={{ fontWeight: "bold" }}>{res.post_user.username}</span></Typography>
                        <Box sx={{ border: 1, borderRadius: 1, borderColor: grey[400], width: '85%', maxWidth: 'lg', margin: "auto", mt: 2, p: 2 }}>
                            <Typography>{res.code}</Typography>
                        </Box>
                        <Typography mt={2} mb={2}>{res.text}</Typography>
                        {res.comments.map((comment) => {
                            return <Comment key={comment._id} comment={comment} />
                        })}
                    </Box>
                setPost(post_info)
            }
        }

        fetchPost();
        return () => { mounted = false; };
    }, [post_id,])



    if (logged) {
        return (
            <div>
                {post}
                <AddComment post_id={post_id} />
            </div>
        );
    } else {
        return (
            <div>
                {post}
                <Box marginTop={3} >
                    <Typography variant="h5">Log in to comment!</Typography>
                    <Button href="/login">
                        Login
                    </Button>
                </Box>
            </div>
        );
    }

}

export default PostDetails;