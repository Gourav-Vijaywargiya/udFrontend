import './App.css';
import Allroute from './components/Allroute';

import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  return (
      <div className="App">
      <Allroute/>
      </div>
  );
  }
export default App;


