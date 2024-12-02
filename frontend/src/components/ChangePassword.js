import axios from "axios";
import React, {useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChangePassword = () => {
    const {token} = useParams();
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();

        try {
            await axios.post('http://localhost:4000/changepassword/:token', {token, username})
            console.log(username)


            navigate("/login")
        } catch (error) {
            setError("")
        }

    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Password"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}

export default ChangePassword;