import { useNavigate } from 'react-router-dom';

const HomeBody = () => {
    const navigate = useNavigate();
    function HandleService(){
        navigate('/signup')
    }
    const scrollToFeatures = () => {
        const element = document.querySelector('.features');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };
    return(
        <div>
            <div className='container'>
                <div className='RecycleBin'>
                    <img alt='' src='/Recycle Bin.png' draggable='false'/>
                </div>
                <div className='conBody'>
                    <p style={{color: '#40ae35'}}>Waste Pickup Made Easy</p>
                    <button className='homebutton' type='submit' onClick={scrollToFeatures} style={{backgroundColor: '#40ae35', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '10px', paddingRight: '10px', color: 'white'}}>Learn more</button>
                </div>
            </div>
            <div className='features'>
                <div className='cards'>
                    <img alt='' src='/Residential Waste.png' style={{height: '150px'}} draggable='false'/>
                    <h1 style={{fontSize: '20px'}}>Residential Waste Pickup</h1>
                    <p>Trash and recycling pickup is the ideal solution for your home and the environment.</p>
                    <p className='GetServiceLink' onClick={HandleService}>Get Residential Pickup Service</p>
                </div>
                <div className='cards'>
                    <img alt='' src='/Comercial Waste.png' style={{height: '150px'}}draggable='false'/>
                    <h1 style={{fontSize: '20px'}}>Commercial Waste Pickup</h1>
                    <p>Commercial trash and recycling pickup offers efficient waste management while supporting environmental sustainability for businesses.</p>
                    <p className='GetServiceLink' onClick={HandleService}>Get Commercial Pickup Service</p>
                </div>
                <div className='cards'>
                    <img alt='' src='/Map.png' style={{height: '150px', borderRadius: '50%'}} draggable='false'/>
                    <h1 style={{fontSize: '20px'}}>Find Nearby Bins</h1>
                    <p>Locate commercial waste bins nearby for efficient disposal and a cleaner, more sustainable environment.</p>
                    <p className='GetServiceLink' onClick={HandleService}>Find me Now !</p>
                </div>
            </div>
            <footer>
                <p>&copy; Trash Tech</p>
            </footer>
        </div>
    )
};

export default HomeBody;