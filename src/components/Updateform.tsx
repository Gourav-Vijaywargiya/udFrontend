import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userProfile, updateFormData, iProps } from "../Interface/common";
import Alert from "./Alert";
import Spinner from "./Spinner";
import UpdateFormNavbar from "./UpdateFormNavbar";
import moment from "moment";

const Updateform = (props: iProps) => {
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
    DateofBirth: "userProfile.date_of_birth",
    Gender: "userProfile.Gender",
    image: "userProfile.image",
    aboutme: "userProfile.aboutme",
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Function to get the data of logged in user
  const getData = async (email: string): Promise<void> => {
    setLoading(false);
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
    setLoading(true);
    setData(temp);
  };

  // Fucntion to handle the change the data of logged in user
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({
      ...data,
      [(e.target as HTMLInputElement).name]: e.target.value,
    });
  };

  const onChangeAbout = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setData({
      ...data,
      [(e.target as HTMLTextAreaElement).name]: e.target.value,
    });
  };

  const onChangegender = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setData({
      ...data,
      [(e.target as HTMLSelectElement).name]: e.target.value,
    });
  };

  const onChangeMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [(e.target as HTMLInputElement).name]: e.target.value.replace(
        /[^\d+]/g,
        ""
      ),
    });
  };

  // Function to handle the change the image of logged in user
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setData({ ...data, image: file });
    }
  };

  // Funcrion to submit the form data of logged in user for updation in database
  const submitData = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    setLoading(true);
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
      "content-type": "multipart/form-data;",
    };

    
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/updatedata`,
      {
        method: "PATCH",
        body: formData,
      }
    );
      setLoading(false);
    Navigate("/home");
    props.showAlert("Profile Updated Successfully", "success");
    return response.json();
  };

  // Use effect to get the data of logged in user
  useEffect(() => {
    if (userProfile) {
      getData(userProfile.email as string);
    } else {
      {
        props.showAlert("Please Login before continue", "warning");
      }
      {
        Navigate("/");
      }
    }
  }, []);

  // console.log("dob", data.DateofBirth);

  // const originalString = data.DateofBirth;
  
  // // Parse string into date object
  // const dateObject = new Date(originalString);
  
  // // Format date object into desired string format
  // const dob = dateObject.toLocaleDateString("en-GB");
  // console.log("dateof birth is ",dob);

  return (
    <>
      {userProfile ? (
        <>
          <UpdateFormNavbar />
          {loading ? (
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
                      <b>
                        First Name<span className="text-danger">*</span>
                      </b>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      placeholder="First name"
                      value={data.firstName}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="lastName">
                      <b>
                        Last Name<span className="text-danger">*</span>
                      </b>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      placeholder="Last name"
                      value={data.lastName}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>

                <div className="row my-2">
                  <div className="col">
                    <label htmlFor="name">
                      <b>Email</b>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Name"
                      value={data.email}
                      disabled
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="Mobile">
                      <b>
                        Mobile<span className="text-danger">*</span>
                      </b>
                    </label>
                    <input
                      type="tel"
                      name="Mobile"
                      className="form-control"
                      placeholder="Mobile No"
                      onChange={onChangeMobile}
                      pattern="[0-9]{10,14}"
                      maxLength={10}
                      value={data.Mobile}
                      required
                    />
                  </div>
                </div>

                <div className="row my-2">
                  <div className="col">
                    <label htmlFor="Gender">
                      <b>
                        Gender<span className="text-danger">*</span>
                      </b>
                    </label>
                    <select
                      name="Gender"
                      className="form-control"
                      value={data.Gender}
                      onChange={onChangegender}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="col">
                    <label htmlFor="DateofBirth">
                      <b>
                        Date of Birth<span className="text-danger">*</span>
                      </b>
                    </label>
                    <input
                      type="date"
                      name="DateofBirth"
                      className="form-control"
                      placeholder="Date of Birth"
                      max={moment().format("YYYY-MM-DD")}
                      onChange={onChange}
                      value={data.DateofBirth}
                    />
                  </div>
                </div>

                <div className="row my-2">
                  <div className="col">
                    <label htmlFor="aboutme">
                      <b>
                        About<span className="text-danger">*</span>
                      </b>
                    </label>
                    <textarea
                      style={{ height: "100px" }}
                      name="aboutme"
                      className="form-control"
                      placeholder="About me"
                      value={data.aboutme}
                      onChange={onChangeAbout}
                      required
                      maxLength={300}
                    ></textarea>
                  </div>
                  <div className="col">
                    <div>
                      <label htmlFor="image" style={{ marginBottom: "35px" }}>
                        <b>Profile Picture</b>
                      </label>{" "}
                    </div>
                    <div style ={{marginTop :"-25px"}}>
                      <input
                        type="file"
                        name="image"
                        className="form-control-file"
                        onChange={handleImageChange}
                      />
                      {typeof data.image === "string" &&
                      data.image.includes("google") ? (
                        <img
                          style={{ width: "100px", height: "80px" }}
                          src={data.image as string}
                          alt="ProfilePic"
                        />
                      ) : (
                        <img
                          style={{ width: "100px", height: "80px" }}
                          src={`${process.env.REACT_APP_API_URL}/uploads/${data.image}`}
                          alt="ProfilePic"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary my-3" type="submit">
                  Submit
                </button>
              </form>
            </div>
          ) : (
            <Spinner />
          )}
        </>
      ) : (
        <>
          {props.showAlert("Please Login to continue", "warning")}
          {Navigate("/")}
        </>
      )}
    </>
  );
};

export default Updateform;
