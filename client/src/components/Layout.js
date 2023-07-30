import { Outlet } from 'react-router-dom';
import Header from './header';
import Login from './login';
import Post from './post';

export default function Layout(){
    return(
        <>
            <main>
                <Header/>
                <Outlet/>
                {/* <Login /> */}
                {/* <Post /> */}
            </main>
        </>
    )
}