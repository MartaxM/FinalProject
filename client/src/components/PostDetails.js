import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddComment from "./AddComment";
import Comment from "./Comment";
import Button from '@mui/material/Button'
import { Typography, Box } from "@mui/material";
import { grey } from "@mui/material/colors";

/**
 * 
 * @returns PostDetails Page, which has the post's info like Post, but also includes the comments
 *          and the AddCommment component to add a comment if user wants to
 */

function PostDetails() {

    const [post, setPost] = useState(null);
    //get the post_id from the route
    let { post_id } = useParams();
    const [logged, setLogged] = useState(false);

    /**
     * useEffect used to check if user is logged in
     * 
     * If logged in, at the end of the page the AddCommment component will appear
     * If not, a message asking to login and a Button to the login page will appear
     * 
     * The if that checks logged is at the end of the file
     */
    useEffect(() => {
        let mounted = true;
        const requestOptions = {
            method: 'GET',
            mode: "cors"
        }
        //Fetch loggin state
        async function fetchLoggingState() {
            let res = await fetch("/api/user/logged_in", requestOptions)
                .catch((e) => {
                    console.log(e);
                })
            if (mounted) {
                setLogged(res.ok)
            }
        }

        fetchLoggingState();
        return () => { mounted = false; };
    }, [])

    /**
     * useEffect used to fetch the posts
     */

    useEffect(() => {
        let mounted = true;
        async function fetchPost() {
            let res = await fetch("/api/post/" + (post_id) + "/details")
                .then(response => response.json())
                .catch((e) => {
                    console.log(e);
                })
            if (mounted) {
                if (res) {
                    /**
                     * Generte the info of the post, it include username, title, text, code snippet and comments
                     * The comments include the username or their writers and the content of the comment
                     * comments are Comment components and their key is their _id
                     */
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
                    //Set post info
                    setPost(post_info)
                }
            }
        }

        fetchPost();
        return () => { mounted = false; };
    }, [post_id,])


    /**
     * This is the if that checks logged and shows content accordingly
     */
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