function Comment(props) {
    const text = props.comment.text;
    const username = props.comment.comment_user.username;

    return (<div>
        <p>{username}</p>
        <p>{text}</p>
    </div>);
}

export default Comment