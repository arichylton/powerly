import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  auth,
  signInWithGoogleRedirect,
  createUserDocumentFromAuth,
  signOutUser,
} from '../../utils/firebase/firebase.utils';
import { getRedirectResult } from 'firebase/auth';
import { UserContext } from '../../contexts/user.context';
import './Header.css';

const Header = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRedirectResult(auth);
      if (response) {
        await createUserDocumentFromAuth(response.user);
        setCurrentUser(response.user);
      }
    };
    fetchData();
  }, []);

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
  };

  const renderIsSignedIn = () => {
    if (!currentUser) {
      return (
        <div>
          <button
            onClick={signInWithGoogleRedirect}
            className='m-2 mr-0 btn btn-primary'
          >
            <span>Sign In With Google</span>
          </button>
        </div>
      );
    } else {
      return (
        <button
          onClick={signOutHandler}
          className='m-2 mr-0 btn btn-outline-danger'
        >
          <span className='v-mid m-4'>Sign-Out</span>
        </button>
      );
    }
  };

  return (
    <div className='header-background fixed-top'>
      <nav className='navbar navbar-light header-nav ghost'>
        <div className='ghost-header'>
          <Link to='/' className='navbar-brand'>
            <span className='v-mid mr-4'>POWER</span>
          </Link>
          <Link to='/wilks' className='navbar-brand ghost'>
            <span className='v-mid mr-4'>Wilks</span>
          </Link>
          {/* <Link to='/goals' className='navbar-brand ghost'>
            <span className='v-mid'>Goals</span>
          </Link> */}
        </div>

        {renderIsSignedIn()}
      </nav>
    </div>
  );
};

export default Header;
