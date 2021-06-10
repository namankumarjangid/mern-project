import React, { useState, useContext } from 'react';
import loginpic from "../images/login.svg";
import { Link, useHistory } from "react-router-dom";
import { clientId } from '../keys';
import { UserContext } from "../App";

import { GoogleLogin } from 'react-google-login';


const Login = () => {
    const { state, dispatch } = useContext(UserContext);

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (e) => {
        e.preventDefault();

        const res = await fetch('/signin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = res.json();

        if (res.status === 400 || !data) {
            window.alert("Invalid Credentials");
        } else {
            dispatch({ type: 'USER', payload: true });
            window.alert("Login Successfull");
            history.push("/");
        }
    }


    // react google login setup here
    const onSuccess = async googleData => {
        const res = await fetch("/googlelogin", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.tokenId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()

        if (data) {
            dispatch({ type: 'USER', payload: true });
            window.alert("Login Successfull");

            history.push("/");
        }
        // store returned user somehow
    }

    const onFailure = (res) => {
        alert("Oops! something went wrong. Try again later")
    };

    return (
        <>
            <section className="sign-in">
                <div className="container mt-5">
                    <div className="signin-content">

                        <div className="signin-image">
                            <figure>
                                <img src={loginpic} alt="Login pic" />
                            </figure>
                            <Link to="/signup" className="signup-image-link">Create an Account</Link>
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title">Sign in</h2>
                            <form method="POST" className="register-form" id="register-form">

                                <div className="form-group">
                                    <label htmlFor="email">
                                        <i className="zmdi zmdi-email material-icons-name"></i>
                                    </label>
                                    <input type="email" name="email" id="email" autoComplete="off"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your Email"
                                    />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="password">
                                        <i className="zmdi zmdi-lock material-icons-name"></i>
                                    </label>
                                    <input type="password" name="password" id="password" autoComplete="off"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Your Password"
                                    />
                                </div>


                                <div className="form-group form-button">
                                    <input type="submit" name="signin" id="signin" className="form-submit"
                                        value="Log In"
                                        onClick={loginUser}
                                    />
                                </div>

                            </form>

                            <GoogleLogin
                                clientId={clientId}
                                buttonText="Login with google"
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default Login
