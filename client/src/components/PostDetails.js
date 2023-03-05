import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddComment from "./AddComment";
import Comment from "./Comment";

function PostDetails() {

    const [post, setPost] = useState(null);
    let { post_id } = useParams();

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
                    <div>
                        <div>
                            <h1>{res.title}</h1>
                            <h2>{res.post_user.username}</h2>
                            <p>{res.text}</p>
                            <p>{res.code}</p>
                            {res.comments.map((comment) => {
                                return <Comment key={comment._id} comment={comment}/>
                            })}
                        </div>

                    </div>
                setPost(post_info)
            }
        }

        fetchPost();
        return () => { mounted = false; };
    }, [post_id,])




    return (
        <div>
            {post}
            <AddComment post_id={post_id} />
        </div>
    );
}

export default PostDetails;