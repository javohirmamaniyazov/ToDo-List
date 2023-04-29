import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'

const Navbar = ({ user, signOut }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top navbar-expand-lg">
            <div className="container-fluid ">
                <div className='navbar'>
                    <a className="navbar-brand" href="/">
                        Yelp
                    </a>
                </div>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">
                                        <FontAwesomeIcon icon={faUserCircle} /> {user.username}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link" onClick={signOut}>
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
                                    </span>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <a className="nav-link" href="/login">
                                    Sign In
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
