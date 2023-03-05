import { Box, Typography } from "@mui/material"
import { grey } from "@mui/material/colors";
function Comment(props) {
    const text = props.comment.text;
    const username = props.comment.comment_user.username;

    return (
        <Box style={{ textAlign: "left" }} sx={{ margin: "auto", bgcolor:grey[100], p:2, borderRadius: 2, mt:2}}>
            <Typography variant="by_user_tag"><span style={{ fontWeight: "bold" }}>&emsp;{username}</span> commented:</Typography>
            <Typography>{text}</Typography>
        </Box>);
}

export default Comment