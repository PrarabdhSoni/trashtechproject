import {useEffect, useState} from 'react';
import "./home.css";
import Header from './Header';
import HomeBody from './homeBody';
import Loading from '../Loading/loading';

const Index = () => {
    const [isLoading, setLoading] = useState("true")

    useEffect(() => {
        const TimeoutId = setTimeout(()=>{
            setLoading(false)
        }, 1000)
        return () => clearTimeout(TimeoutId);
    })
    
    
    return(
        <div>
            {isLoading ?(
                <Loading/>
            ):(
            <div className='homepage'>
                <Header/>
                <HomeBody />
            </div>
            )}
        </div>
    );
};

export default Index;
