import { useEffect, useState } from "react";
import Post from "../components/post";

function IndexPage(){
const [posts,setPosts] = useState([]);


    useEffect(() =>{
        
        fetch('http://localhost:4000/api/post').then(response =>{
            response.json().then(posts =>{
                setPosts(posts);
                console.log(process.env.REACT_APP_API_URL);
            });
        });
    }, []);
    // console.log(posts.length);
    return(
        <>
            
            {/* <Post />
            <Post />
            <Post /> */}
            
            {posts.length > 0 && posts.map(post => (
                <Post {...post} />
        ))}
        </>
    )
}

export default IndexPage;