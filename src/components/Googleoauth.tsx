import { useGoogleLogin } from "@react-oauth/google";
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { googleOauthProfile, googleOauthUser, iProps } from "../Interface/common";
import { registrationSchema } from "../Schemas/Validation";
import { useFormik } from "formik";
import Spinner from "./Spinner";
import Alert from "./Alert";

const Googleoauth = (props :iProps) => {
  const [user, setUser] = useState<googleOauthUser | null>();
  const [profile, setProfile] = useState<googleOauthProfile | null>();
  const [mobile, setMobile] = useState<string>();
  const [gender, setGender] = useState<string>("");
  const [dob, setDOB] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [aboutme, setAboutMe] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
 
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed", error),
  });

  // Check if the user is already registered or not
  const authenticate = async() => {
    
    
    axios
      .post(`${process.env.REACT_APP_API_URL}/data/checkuser`, {
        email: profile && profile.email,
      })
      .then((res) => {
        if (res.data.status) {
          setLoading(false);
          updateloginTime(profile!.email);
          props.showAlert("Login Successful", "success");
          navigate("/home");
          setShow(true);
        } else {
          navigate("/registration");
          setShow(false);
        }
      });
  };

  

  // Uppdate login time in database
  const updateloginTime = async (email: String) => {
    let lastlogin: String = Date();

    let newData = { lastlogin, email: email };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/updatelogintime`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newData),
      }
    );
  };



  // call the authenticate method to check if the user with this email  is already registered or not
  if (profile && profile.email) {
    localStorage.setItem("profile", JSON.stringify(profile));
    authenticate();         // once we have the user details, we need to authenticate the user to display and route to the dashboard page
  }

  useEffect(() => {
    if (user && user.access_token) {
      navigate("/");
      let url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${user.access_token}`;
      let authorization = `Bearer ${user.access_token}`;
      axios
        .get(url, {
          headers: {
            Authorization: authorization,
            Accept: "application/json",
          },
        })
        .then((res) => {
          setProfile(res.data);
          
        })
        .catch((error) => {
          console.log("error", error);
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
      className="container"
      style={{
        background: "linear-gradient(to bottom, #FFC300, #FF5733), #F44336",
        boxShadow: "10px 10px blur lightblue",
        marginTop: "190px",
        height: "400px",
        width: "600px",
      }}
     >
      
      <br />
      <br />
      <div style={{ marginLeft: "50px", marginTop: "45px" }}>
        <h1>Welcome to User Directory</h1>
      </div>
      <Button
        variant="danger"
        onClick={clickHandler
        }
        style={{ marginLeft: "185px", marginTop: "80px" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <FaGoogle className="mx-2" />
          <span>Sign in with Google</span>
        </div>
      </Button>
    </div>}
    </>
    

  );
};

export default Googleoauth;
