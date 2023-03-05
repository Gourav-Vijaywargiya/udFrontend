import './App.css';
import Allroute from './components/Allroute';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';
import { iAlert } from './Interface/common';
import Alert from './components/Alert';


function App() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  const [alert,setAlert] = useState<iAlert | null>(null);
  //function to show alert
  const showAlert = (message:string, type:string) :void => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 2500);
  };
  return (
    <>
    
      <div className="App">
      <Allroute showAlert = {showAlert} alert ={alert}/>
      </div>
    </>
  );
  }
export default App;


