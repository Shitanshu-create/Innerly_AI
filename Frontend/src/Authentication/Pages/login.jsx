import "../auth.form.scss"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const Login = () => {
    const navigate = useNavigate();

    const { loading, handleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await handleLogin({ email, password });
        if (result.success) {
            navigate("/");
        } else {
            alert(result.message || "Login failed. Please check your credentials.");
        }
    }

    if (loading) {
        return (<main><h1>Loading...</h1></main>)
    }

    return (
        <>
            <main className="login-main">
                <div className="form-container">
                    <h1>Login Page</h1>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" placeholder='Email' />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder='Password' />
                        </div>
                        <button className="btn-primary button" type="submit">Login</button>
                    </form>


                    <p>Need an account? <Link to={"/register"}>Sign Up</Link></p>

                </div>
            </main>
        </>
    )
}

export default Login
