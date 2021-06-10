import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from "react-router-dom";
import { UserContext } from "../App";


const Navbar = () => {

    const { state, dispatch } = useContext(UserContext);
    console.log(`the navbar user ${state} and ${dispatch}`);

    const RenderList = () => {

        if (state) {
            return (
                <>
                    <li className="nav-item active">
                        <Link exact activeClassName="active-page" className="nav-link" to="/">Home </Link>
                    </li>
                    <li className="nav-item">
                        <Link exact activeClassName="active-page" className="nav-link" to="/about">AboutMe</Link>
                    </li>
                    <li className="nav-item">
                        <Link exact activeClassName="active-page" className="nav-link" to="/contact">Contact</Link>
                    </li>
                    <li className="nav-item">
                        <Link exact activeClassName="active-page" className="nav-link" to="/logout">logout</Link>
                    </li>
                </>

            )
        } else {
            return (
                <>
                    <li className="nav-item active">
                        <Link exact activeClassName="active-page" className="nav-link" to="/">Home </Link>
                    </li>
                    <li className="nav-item">
                        <Link exact activeClassName="active-page" className="nav-link" to="/contact">Contact</Link>
                    </li>
                    <li className="nav-item">
                        <Link exact activeClassName="active-page" className="nav-link" to="/about">AboutMe</Link>
                    </li>

                    <li className="nav-item">
                        <Link exact activeClassName="active-page" className="nav-link" to="/login">Login</Link>
                    </li>

                    <li className="nav-item">
                        <Link exact activeClassName="active-page" className="nav-link" to="/signup">Register</Link>
                    </li>


                </>
            )
        }
    };


    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="#">
                    <h3>NAMAN</h3>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">

                        <RenderList />


                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar
