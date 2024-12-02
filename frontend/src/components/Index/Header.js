import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    function Handler(){
        navigate('/signup');
    }
    function HandlerI(){
        navigate('/login')
    }
    return(
        <div className='navheading'>
            <nav className='navbar'>
            <img className='heading' alt="" src='/Logo.png' draggable='false'/>
            <div>
                <button className='homebutton' type='submit' onClick={Handler} style={{backgroundColor: '#40ae35', color: 'white'}}>Sign Up</button>
                <button className='homebutton' type='submit' onClick={HandlerI} style={{backgroundColor: '#2589f6', color: 'white'}}>Log In</button>
            </div>
            </nav>
        </div>
    )
}

export default Header;
