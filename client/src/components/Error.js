function Error(props) {
    const text = props.errormsg;

    return (
    <Box style={{ textAlign: "left" }} sx={{ margin: "auto", bgcolor:grey[100], p:2, borderRadius: 2, mt:2}}>
        <Typography variant="error">Something went wrong... Redirecting</Typography>
    </Box>);
}

export default Error