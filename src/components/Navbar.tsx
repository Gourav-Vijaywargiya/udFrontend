import { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { IUserProfile, IProfilePic, IUser } from "../Interface/common";
import { useNavigate } from "react-router";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [profilepic, setProfilePic] = useState<string>("");
  const userProfile: IUserProfile = JSON.parse(
    localStorage.getItem("userprofile") as string
  );
  const navigate = useNavigate();
  const [data, setData] = useState<IUser | null>();

  // Function to get image of logged in user
  const getData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/fetchdata/${userProfile.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let temp: IProfilePic = await response.json();
    temp && setData(temp!);
    temp && setProfilePic(temp!.image);
  };

  // Function to logout user
  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate("/");
  };

  // Use effect to call the funcion to get image of logged in user
  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ marginTop: "130px" }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-position ">
        <div className="container-fluid">
          <span className="navbar-brand">User Directory</span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto"></ul>
            <ul className="navbar-nav">
              <h6 className="nav-link active">
                <b>Login Time : {data && data.lastlogin.slice(0, 24)}</b>
              </h6>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="link" id="dropdown-basic">
                    {profilepic.includes("google") ? (
                      <img
                        className="navbar-image"
                        src={profilepic}
                        alt="ProfilePic"
                      />
                    ) : (
                      profilepic && (
                        <img
                          className="navbar-image"
                          src={`${process.env.REACT_APP_API_URL}/uploads/${profilepic}`}
                          alt="ProfilePic"
                        />
                      )
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end">
                    <Dropdown.Item>
                      <b>Hello, {userProfile.name}</b>
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/data/updatedata">
                      Update Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      className="navbar-logout"
                      as={Link}
                      to="/"
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

export default Navbar;
