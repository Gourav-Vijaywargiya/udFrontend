import {
  googleLogout,
  useGoogleLogin
} from "@react-oauth/google";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import moment from "moment";
import { Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { googleOauthProfile, googleOauthUser } from "../Interface/common";

const Googleoauth = () => {
  const [user, setUser] = useState<googleOauthUser| null>();
  const [profile, setProfile] = useState<googleOauthProfile | null>();
  const [mobile, setMobile] = useState<number>();
  const [gender, setGender] = useState<string>("");
  const [dob, setDOB] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [aboutme, setAboutMe] = useState<string>("");
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed", error),
  });

  // Check if the user is already registered or not
  const authenticate = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/data/checkuser`, {
        email: profile && profile.email,
      })
      .then((res) => {
        if (res.data.status) {
          setShow(true);
        } else {
          setShow(false);
        }
      });
  };


  // Submit data to the database
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userDetails = {
      mobile,
      dob,
      gender,
      aboutme,
      loginTime: moment().format("YYYY-MM-DD HH:mm:ss a"),
      lastlogin: Date(),
      ...profile,
    };

    axios.post(`${process.env.REACT_APP_API_URL}/data/userdetails`, userDetails);
    localStorage.setItem("profile", JSON.stringify(userDetails));
    navigate("/home");
  };


  // Uppdate login time in database
  const updateloginTime = async (email: String) => {
    let lastlogin : String= Date();
    
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
  }

  // call the authenticate method to check if the user with this email  is already registered or not
  if (profile && profile.email) {
    authenticate(); // once we have the user details, we need to authenticate the user to display and route to the dashboard page
    // updateloginTime(profile.email);
    localStorage.setItem("profile", JSON.stringify(profile));
  }

  useEffect(() => {
    if (user && user.access_token) {navigate('/');
        let url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${user.access_token}`
        let authorization = `Bearer ${user.access_token}`
      axios.get(url,
          {
            headers: {
              Authorization: authorization,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((error) => {
            console.log("Wrrr" ,error);
          console.log(error);
        });
    }
  }, [user]);

  // Logout function to logged out user
  const logOut = () => {
    googleLogout();
    localStorage.clear();
    navigate("/");
    setProfile(null);
    setUser(null);
  };

  

  return (
    <div>
      {profile && profile.email ? (
        <>
          {show ? (
            updateloginTime(profile.email),
            navigate("/home")
          ) : (
            <div style ={{margin: "20px"}}>
              <img style ={{margin: "5px"}} src={profile.picture} alt="Profile Picture" />
              <h3 style ={{margin: "1px"}}>{profile.name} LoggedIn</h3>
              <h6 style ={{marginTop: "5px"}}>Name : {profile.name}</h6>
              <h6 style ={{marginTop: "5px"}}>Email : {profile.email}</h6>
              <button className=" btn btn-danger my-3" onClick={logOut}>
                logout
              </button>
              <br />
              <br />
            </div>
          )}
        </>
      ) : (
        <div className ="container" style ={{background: "linear-gradient(to bottom, #FFC300, #FF5733), #F44336",boxShadow: "10px 10px blur lightblue",marginTop:"190px",height:"400px" ,width: "600px"}}>
          <br/>
          <br/>
            <p style={{marginLeft:"50px", marginTop:"45px"}}><h1>Welcome to User Directory</h1></p>
            <Button
            variant="danger"
            onClick={() => login()}
            style={{ marginLeft: "185px",marginTop: "80px"}}
          >
            
            <div className="d-flex justify-content-between align-items-center">
              <FaGoogle className="mx-2" />
              <span>Sign in with Google</span>
            </div>
          </Button>
        </div>
      )}
      {user && user.access_token && (
        <form style ={{marginLeft: "20px"}}onSubmit={handleSubmit}>
          <h3>Enter Required Details</h3>
          <label style ={{marginRight:"5px"}} htmlFor="mobile"><b>Mobile No:</b></label>
          <input
            type="tel"
            name="mobile"
            value={mobile!}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMobile(Number((e.target as HTMLInputElement).value))
            }
            required
          />

          <label style ={{marginLeft:"10px", marginRight:"5px"}} htmlFor="dob"><b>Date of Birth:</b></label>
          <input
            type="date"
            name="dob"
            value={dob}
            onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
              setDOB(e.target.value)
            }
            required
          />

          <label style ={{marginLeft:"10px", marginRight:"5px"}} htmlFor="gender"> <b>Gender:</b></label>
          <input
            type="gender"
            name="gender"
            value={gender}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGender((e.target as HTMLInputElement).value)
            }
            required
          />

          <label style ={{marginLeft:"10px", marginRight:"5px"}} htmlFor="aboutme"><b>About Me:</b></label>
          <input
            type="text"
            name="aboutme"
            value={aboutme}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAboutMe((e.target as HTMLInputElement).value)
            }
            required
          />

          <button className ="btn btn-success" style ={{marginLeft: "10px", marginBottom:"8px"}} type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Googleoauth;

