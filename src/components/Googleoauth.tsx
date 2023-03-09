import { useGoogleLogin } from '@react-oauth/google';
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { IGoogleOauthProfile, IGoogleOauthUser, iProps } from '../Interface/common';
// import { registrationSchema } from '../Schemas/Validation';
// import { useFormik } from 'formik';
import Spinner from './Spinner';
import Alert from './Alert';

import '../App.css'

const Googleoauth = (props :iProps) => {
  const [user, setUser] = useState<IGoogleOauthUser | null>();
  const [userprofile, setUserProfile] = useState<IGoogleOauthProfile | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
 
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed', error),
  });

  // Check if the user is already registered or not
  const authenticate = async() => {
    
    
    axios
      .post(`${process.env.REACT_APP_API_URL}/data/checkuser`, {
        email: userprofile && userprofile.email,
      })
      .then((res) => {
        if (res.data.status) {
          setLoading(false);
          updateloginTime(userprofile!.email);
          props.showAlert('Login Successful', 'success');
          navigate('/home');
        } else {
          navigate('/registration');
        }
      }).catch((err) => {
        
      });
  };

  

  // Uppdate login time in database
  const updateloginTime = async (email: String) => {
    let lastlogin: String = Date();

    let newData = { lastlogin, email: email };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/updatelogintime`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(newData),
      }
    );
  };



  // call the authenticate method to check if the user with this email  is already registered or not
  if (userprofile && userprofile.email) {
    localStorage.setItem('userprofile', JSON.stringify(userprofile));
    authenticate();         // once we have the user details, we need to authenticate the user to display and route to the dashboard page
  }

  useEffect(() => {
    if (user && user.access_token) {
      navigate('/');
      let url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${user.access_token}`;
      let authorization = `Bearer ${user.access_token}`;
      axios
        .get(url, {
          headers: {
            Authorization: authorization,
            Accept: 'application/json',
          },
        })
        .then((res) => {
          setUserProfile(res.data);
          
        })
        .catch((error) => {
          console.log('error', error);
          console.log(error);
        });
    }
  }, [user]);

  const clickHandler = () => {
    setLoading(true);
    login()
  }

  

  return (
    
    <>
    <Alert showAlert = {props.showAlert} alert ={props.alert}/>
    {loading && <Spinner/>}
    {!loading && <div
      className='container loginbox'
     >
      <br />
      <br />
      <div className = 'heading'>
        <h1>Welcome to User Directory</h1>
      </div>
      <Button className = 'button'
        variant='danger'
        onClick={clickHandler
        }
      >
        <div className='d-flex justify-content-between align-items-center'>
          <FaGoogle className='mx-2' />
          <span>Sign in with Google</span>
        </div>
      </Button>
    </div>
    }
    </>
    

  );
};

export default Googleoauth;
