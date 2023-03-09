import React, { useState, useEffect } from "react";
import { IUser, IDatatype, IUserProfile, iProps } from "../Interface/common";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router";
import axios from "axios";
import moment from "moment";
import Alert from "./Alert";

const Registration = (props: iProps) => {
  const [profile, setProfile] = useState<IUserProfile | null>(
    JSON.parse(localStorage.getItem("userprofile") as string)
  );
  const [mobile, setMobile] = useState<string>();
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<string>("");
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
      loginTime: moment().format("DD-MM-YYYY HH:mm:ss a"),
      lastlogin: Date(),
      ...profile,
    };

    axios.post(
      `${process.env.REACT_APP_API_URL}/data/userdetails`,
      userDetails
    );
    localStorage.setItem("userprofile", JSON.stringify(userDetails));
    navigate("/home");
    props.showAlert("Registerd Successfully", "Success");
  };

  return (
    <div className ="container form">
      <div>
        <img
          src={profile!.picture}
          alt="Profile Picture"
        />
        <h3 >{profile!.name} LoggedIn</h3>
        <h6 >Name : {profile!.name}</h6>
        <h6 >Email : {profile!.email}</h6>
        <button className=" btn btn-danger my-3" onClick={logOut}>
          logout
        </button>
        <br />
        <br />
      </div>
      <form  onSubmit={handleSubmit}>
        <h3>Enter Required Details</h3>
        <div className = "form-details">
        <label htmlFor="mobile">
          <b>
            Mobile No:<span className="text-danger">*</span>
          </b>
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
      </div>

      <div className = "form-details">
        <label htmlFor="dob">
          <b>
            Date of Birth:<span className="text-danger">*</span>
          </b>
        </label>
        <input
          type="date"
          name="dob"
          value={dob}
          max={moment().format("YYYY-MM-DD")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDob(e.target.value)
          }
          required
        />
        </div>

        <div className = "form-details">
        <label
          htmlFor="gender"
        >
          <b>
            Gender:<span className="text-danger">*</span>
          </b>
        </label>
        
        <select
          name="gender"
          value={gender}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setGender(e.target.value)
          }
          required
        >
          <option value="">--Select Gender--</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        </div>

        <div className = "form-details">
        <label
          htmlFor="aboutme"
        >
          <b>
            About Me:<span className="text-danger">*</span>
          </b>
        </label>
        <textarea
          name="aboutme"
          value={aboutme}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setAboutMe((e.target as HTMLTextAreaElement).value)
          }
          maxLength ={300}
          required
        ></textarea>
      </div>
      <div>
        <button
          className="btn btn-success my-2"
          type="submit"
        >
          Submit
        </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
