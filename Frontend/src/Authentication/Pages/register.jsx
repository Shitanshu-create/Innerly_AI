import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";
import "../auth.form.scss"

const Register = () => {
    const navigate = useNavigate();
    const { handleRegister, loading} = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await handleRegister({ username, email, password });
        if (success) {
            navigate("/");
        } else {
            alert("Registration failed. Please try a different username or email.");
        }
    }
    
    if (loading) {
        return (<main><h1>Loading...</h1></main>)
    }
     
    return (
        <>
            <main className="register-main">
                <div className="form-container">
                    <h1>SignUp Page</h1>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="Username">Username</label>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" id="Username" name="Username" placeholder='Username' />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" placeholder='Email' />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder='Password' />
                        </div>
                        <button className="btn-primary button" type="submit">SignUp</button>
                    </form>

                    <p>Already have an account? <Link to={"/login"}>Login</Link></p>

                </div>
            </main>
        </>
    )
}

export default Register
