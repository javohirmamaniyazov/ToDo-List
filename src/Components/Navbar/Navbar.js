// Navbar.js
import React from 'react';
import { Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './Navbar.css';

const Navbar = ({ user, signOut, toggleCreateForm, toggleDropdown, showDropdown }) => {
  return (
    <nav className="navbar">
      <div className="navbarItems">
        <span className="projectName">
          <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Yelp_Logo.svg/930px-Yelp_Logo.svg.png?20210803213252' width="150px" height="65px" style={{ marginLeft: '35px' }} />
        </span>
        <Button onClick={toggleCreateForm} className="createRestauranButton">
          Create Restaurant
        </Button>
        <div className="userProfileDropown">
          <Button onClick={toggleDropdown} className="userNameButton">
            {user.username} ▼
          </Button>
          {showDropdown && (
            <div className="dropdownContent">
              <div className="dropdownItem" oClick={signOut}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
