import { useEffect, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { IUserProfile, IProfilePic } from '../Interface/common';
import { useNavigate } from 'react-router';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UpdateFormNavbar = () => {
  const userProfile: IUserProfile = JSON.parse(
    localStorage.getItem('userprofile') as string
  );
  const [profilepic, setProfilePic] = useState<string>('');
  const navigate = useNavigate();

  // Function to get image of logged in user
  const getData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/fetchdata/${userProfile.email}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    let temp: IProfilePic = await response.json();
    setProfilePic(temp.image);
  };

  // Function to logout user
  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate('/');
  };

  // Use effect to call the funcion to get image of logged in user
  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ marginTop: '110px' }}>
      <nav className='navbar navbar-expand-lg navbar-dark bg-dark navbar-position'>
        <div className='container-fluid'>
          <span className='navbar-brand'>User Directory</span>
          <ul className='navbar-nav mt-1' >
            <Link className='nav-link' to='/home'>
              <b>Home</b>
            </Link>
          </ul>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav me-auto'></ul>
            <ul className='navbar-nav'>
              <li className='nav-item dropdown'>
                <Dropdown>
                  <Dropdown.Toggle variant='link' id='dropdown-basic'>
                    {profilepic.includes('google') ? (
                      <img
                        className='navbar-image '
                        src={profilepic}
                        alt='ProfilePic'
                      />
                    ) : (
                      profilepic && (
                        <img
                          className='navbar-image'
                          src={`${process.env.REACT_APP_API_URL}/uploads/${profilepic}`}
                          alt='ProfilePic'
                        />
                      )
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu align='end'>
                    <Dropdown.Item>
                      <b>Hello, {userProfile.name}</b>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      className='navbar-logout'
                      as={Link}
                      to='/'
                      onClick={logout}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default UpdateFormNavbar;
