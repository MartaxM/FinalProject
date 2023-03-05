import { useState, useEffect } from "react";
import Post from './Post'

function Index() {

    const [posts, setPost] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function fetchPost() {
            let res = await fetch("/api/posts")
                .then(response => response.json())
                .catch((e) => {
                    console.log(e);
                })
            if (mounted) {

                let post_list = res.map((post) => {
                    return <Post key={post._id}
                        post_id={post._id}
                        title={post.title}
                        username={post.username}
                        text={post.text}
                        code={post.code}
                    />
                })
                setPost(post_list)
            }
        }

        fetchPost();
        return () => { mounted = false; };
    }, [])


    return (
        <div>
            {posts}
        </div>
    );
}

export default Index;