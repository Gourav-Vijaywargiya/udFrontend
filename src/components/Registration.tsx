import React, { useState, useEffect } from "react";
import { user, datatype, userProfile, iProps } from "../Interface/common";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router";
import axios from "axios";
import moment from "moment";
import Alert from "./Alert";

const Registration = (props : iProps) => {
  const [profile, setProfile] = useState<userProfile | null>(
    JSON.parse(localStorage.getItem("profile") as string)
  );
  const [mobile, setMobile] = useState<string>();
  const [gender, setGender] = useState<string>("");
  const [dob, setDOB] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [aboutme, setAboutMe] = useState<string>("");
  const navigate = useNavigate();


  const logOut = () => {
    googleLogout();
    localStorage.clear();
    navigate("/");
    setProfile(null);
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

    axios.post(
      `${process.env.REACT_APP_API_URL}/data/userdetails`,
      userDetails
    );
    localStorage.setItem("profile", JSON.stringify(userDetails));
    navigate("/home");
    props.showAlert("Registerd Successfully","Success");
  };

  return (
    <>
      <div style={{ margin: "20px" }}>
        <img
          style={{ margin: "5px" }}
          src={profile!.picture}
          alt="Profile Picture"
        />
        <h3 style={{ margin: "1px" }}>{profile!.name} LoggedIn</h3>
        <h6 style={{ marginTop: "5px" }}>Name : {profile!.name}</h6>
        <h6 style={{ marginTop: "5px" }}>Email : {profile!.email}</h6>
        <button className=" btn btn-danger my-3" onClick={logOut}>
          logout
        </button>
        <br />
        <br />
      </div>
      <form style={{ marginLeft: "20px" }} onSubmit={handleSubmit}>
        <h3>Enter Required Details</h3>
        <label style={{ marginRight: "5px" }} htmlFor="mobile">
          <b>Mobile No:<span className="text-danger">*</span></b>
        </label>
        <input
          type="tel"
          name="mobile"
          value={mobile!}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMobile(e.target.value.replace(/[^\d+]/g, ""))
          }
          pattern="[0-9]{10,14}"
          maxLength={10}
          required
        />

        <label style={{ marginLeft: "10px", marginRight: "5px" }} htmlFor="dob">
          <b>Date of Birth:<span className="text-danger">*</span></b>
        </label>
        <input
          type="date"
          name="dob"
          value={dob}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDOB(e.target.value)
          }
          required
        />

        <label
          style={{ marginLeft: "10px", marginRight: "5px" }}
          htmlFor="gender"
        >
          {" "}
          <b>Gender:<span className="text-danger">*</span></b>
        </label>
        <input
          type="gender"
          name="gender"
          value={gender}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setGender((e.target as HTMLInputElement).value)
          }
          required
        />

        <label
          style={{ marginLeft: "10px", marginRight: "5px" }}
          htmlFor="aboutme"
        >
          <b>About Me:<span className="text-danger">*</span></b>
        </label>
        <textarea
          name="aboutme"
          style ={{marginBottom: "-3px",height:"28px"}}
          value={aboutme}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setAboutMe((e.target as HTMLTextAreaElement).value)
          }
          required
        ></textarea>

        <button
          className="btn btn-success"
          style={{ marginLeft: "10px", marginBottom: "8px" }}
          type="submit"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Registration;
