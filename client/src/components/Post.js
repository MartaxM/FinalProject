import { Link  } from "@mui/material"

function Post(props) {

    const post_id = props.post_id
    const title = props.title
    const username = props.username
    const text = props.text
    const code = props.code
    
    return (
        <div id="Index">
            <Link href={"/post/"+post_id} >{title}</Link>
            <p>{username}</p>
            <p>{text}</p>
            <p>{code}</p>
        </div>
    );
}

export default Post;