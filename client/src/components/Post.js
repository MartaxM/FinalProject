import { Link, Box, Typography } from "@mui/material"
import { grey } from "@mui/material/colors"

function Post(props) {

    const post_id = props.post_id
    const title = props.title
    const username = props.username
    const text = props.text
    const code = props.code

    return (
        <Box sx={{ border: 1, borderRadius: 1, borderColor: grey[400], width: '80%', maxWidth: 'lg', margin: "auto", mt: 2, p: 2 }}
            style={{ textAlign: "left" }}>
            <Link href={"/post/" + post_id} underline="hover">
                <span style={{ fontWeight: "bold" }}>{title}</span> by {username}
            </Link>
            <Typography>{text}</Typography>
            <Typography variant="greytext" p={1} >{code}</Typography>
        </Box>
    );
}

export default Post;