function Index() {


    const logOut= (e)=>{
        e.preventDefault();
        fetch("/api/user/logout", {method: 'POST'})
        .then(response => response.json)
    }

    return (
        <div id="Index">
            <h1>Index page</h1>
            <a href="/login"> Log in </a>
            <a href="/register"> Register </a>
            <button onClick={logOut}> Log out </button>
            
        </div>
    );
}

export default Index;