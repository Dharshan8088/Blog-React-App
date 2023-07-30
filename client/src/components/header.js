import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Header(){
    const {setUserInfo,userInfo}= useContext(UserContext);
    var check = 0;
    useEffect( () => {
        const url =  `${process.env.REACT_APP_API_URL}/api/profile`;
        fetch(url, {
            credentials:'include',
            
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                
            });
        });
    },[]);

    function logout() {
        fetch("http://localhost:4000/api/logout", {
            credentials: 'include',
            method: 'POST',
        });
        check=1;
        setUserInfo(null);
    }
    if(check){
        return (<Navigate to ={'/'}/>)

    }
    const username = userInfo?.username;
    return(
        
            
            <header>
                <Link to="/" className="logo">My Blog</Link>
                <nav>
                {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout} ><Link to="/">Logout ({username})</Link></a>
          </>
        )}
                    {!username && (
                        <>
                            <Link to="/login" className="">Login</Link>
                            <Link to="/register" className="">Register</Link>
                        </>
                    )}
                </nav>
            </header>
        
    );
}

export default Header;

