import { useState, useEffect } from "react";
import Post from './Post'
import '../App.css';
import { Typography, Box } from "@mui/material";

/**
 * 
 * @returns Index component, acts as the homepage where the posts are shown
 */

function Index() {

    const [posts, setPost] = useState(null);

    /**
     * To fetch the posts
     */
    useEffect(() => {
        let mounted = true;
        async function fetchPost() {
            let res = await fetch("/api/posts")
                .then(response => response.json())
                .catch((e) => {
                    console.log(e);
                })
            if (mounted) {
                //Create a list of Post Components to show
                let post_list = res.slice(0).reverse().map((post) => {
                    return <Post key={post._id}
                        post_id={post._id}
                        title={post.title}
                        username={post.post_user.username}
                        text={post.text}
                        code={post.code}
                    />
                })
                //sets the posts
                setPost(post_list)
            }
        }

        fetchPost();
        return () => { mounted = false; };
    }, [])


    return (
        <Box>
            <Typography variant="title">Posts</Typography>
            <Box>
                {posts}
            </Box>
        </Box>
    );
}

export default Index;