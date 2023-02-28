import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userProfile, updateFormData } from "../Interface/common";
import UpdateFormNavbar from "./UpdateFormNavbar";

const Updateform = () => {
  const userProfile: userProfile = JSON.parse(
    localStorage.getItem("profile") as string
  );
  const Navigate = useNavigate();
  const [data, setData] = useState<updateFormData>({
    name: "userProfile.name",
    firstName: "userProfile.given_name",
    lastName: "userProfile.family_name",
    email: "userProfile.email",
    Mobile: "userProfile.mobile",
    DateofBirth: "userProfile.DateofBirth",
    Gender: "userProfile.Gender",
    image: "userProfile.image",
    aboutme: "userProfile.aboutme",
  });

  // Function to get the data of logged in user
  const getData = async (email: string): Promise<void> => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/fetchdata/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let temp = await response.json();
    setData(temp);
  };

  // Fucntion to handle the change the data of logged in user
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({
      ...data,
      [(e.target as HTMLInputElement).name]: e.target.value,
    });
  };

  // Function to handle the change the image of logged in user
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setData({ ...data, image: file
      })
    }
  };

  // Funcrion to submit the form data of logged in user for updation in database
  const submitData = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    let newData = { ...data, email: userProfile.email };

    const formData = new FormData();
  
    formData.append("email", newData.email);
    formData.append("name", newData.name);
    formData.append("lastName", newData.lastName);
    formData.append("firstName", newData.firstName);
    formData.append("DateofBirth", newData.DateofBirth);
    formData.append("Gender", newData.Gender);
    formData.append("aboutme", newData.aboutme);
    formData.append("image", newData.image);
    formData.append("Mobile", newData.Mobile);


    const headers = {
      "content-type": 'multipart/form-data;' 
    };

    console.log(formData);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/updatedata`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    Navigate("/home");
    return response.json();
  };

  // Use effect to get the data of logged in user
  useEffect(() => {
    getData(userProfile.email as string);
  }, []);

  return (
    <>
      <UpdateFormNavbar />
      <div>
        <div
          style={{
            marginLeft: "30px",
            marginBottom: "30px",
            marginTop: "15px",
          }}
        >
          <h1>Details</h1>
        </div>
        <form
          onSubmit={submitData}
          style={{ marginLeft: "30px", marginRight: "30px" }}
          encType="multipart/form-data"
        >
          <div className="row my-2">
            <div className="col">
              <label htmlFor="firstName">
                <b>First Name</b>
              </label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="First name"
                value={data.firstName}
                onChange={onChange}
              />
            </div>
            <div className="col">
              <label htmlFor="lastName">
                <b>Last Name</b>
              </label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Last name"
                value={data.lastName}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="row my-2">
            <div className="col">
              <label htmlFor="name">
                <b>Full Name</b>
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                value={data.name}
                onChange={onChange}
              />
            </div>
            <div className="col">
              <label htmlFor="Mobile">
                <b>Mobile</b>
              </label>
              <input
                type="integer"
                name="Mobile"
                className="form-control"
                placeholder="Mobile No"
                onChange={onChange}
                value={data.Mobile}
              />
            </div>
          </div>

          <div className="row my-2">
            <div className="col">
              <label htmlFor="Gender">
                <b>Gender</b>
              </label>
              <input
                type="text"
                name="Gender"
                className="form-control"
                placeholder="Gender"
                onChange={onChange}
                value={data.Gender}
              />
            </div>
            <div className="col">
              <label htmlFor="DateofBirth">
                <b>Date of Birth</b>
              </label>
              <input
                type="date"
                name="DateofBirth"
                className="form-control"
                placeholder="Date of Birth"
                onChange={onChange}
                value={data.DateofBirth}
              />
            </div>
          </div>

          <div className="row my-2">
            <div className="col">
              <label htmlFor="aboutme">
                <b>About</b>
              </label>
              <input
                style={{ height: "100px" }}
                type="text"
                name="aboutme"
                className="form-control"
                placeholder="About me"
                value={data.aboutme}
                onChange={onChange}
              />
            </div>
            <div className="col">
              <div>
                <label htmlFor="image" style={{ marginBottom: "35px" }}>
                  <b>Profile Picture</b>
                </label>{" "}
              </div>
              <input
                type="file"
                name="image"
                className="form-control-file"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <button className="btn btn-primary my-3" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Updateform;
