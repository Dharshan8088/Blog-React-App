
import { useState } from 'react';
import '../App.css';

function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    async function register(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/api/register', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
        })
        if(response.status === 200){
            alert('registration successful');
        }else{
            alert('registartion failed');
        }
    }
    return(
        <>
            <form className="register" onSubmit={register}>
                <h1>Register</h1>
                <input type="text" placeholder="Username" 
                    value={username} 
                    onChange={ev => setUsername(ev.target.value)} 
                ></input>
                <input type="password" placeholder="Password" 
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)}>
                 </input>
                <button className='register-button'>Register</button>
            </form>
        </>
    )
}

export default RegisterPage;