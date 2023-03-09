import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { IUser, IDatatype, IUserProfile, iProps } from "../Interface/common";
import Alert from "./Alert";
import Navbar from "./Navbar";
import Spinner from "./Spinner";
import moment from "moment";

const Fetchdata = (props: iProps) => {
  const userprofile: IUserProfile = JSON.parse(
    localStorage.getItem("userprofile") as string
  );
  const [data, setData] = useState<IUser[] | null>([]);
  const [page, setPage] = useState<number>(1);
  const [totalResult, setTotalResult] = useState<number>(0);
  const [searchTitle, setSearchTitle] = useState<string | number>("");
  const limit: number = 5;
  const navigate = useNavigate();
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const [searchPage, setSearchPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Funtion to get complete data
  const getData = async () => {
    setPage(searchPage);
    setLoading(false);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/fetchdata`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let temp: IDatatype = await response.json();
    setLoading(true);
    setData(temp.User);
    setTotalResult(Number(temp.totalResults));
  };

  // Function to get searched data
  const getSearchData = async () => {
    setSearchPage(page);
    setPage(1);
    setLoading(false);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/fetchsearchdata/${searchTitle}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let temp: IDatatype = await response.json();
    if (temp.User.length > 0) {
      props.showAlert("User found", "info");
    } else {
      props.showAlert("User not found", "info");
    }
    setLoading(true);
    setData(temp.User);
    setTotalResult(Number(temp.totalResults));
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      getSearchData();
    }
  };

  // funtion to change page number according to pagination
  const changePage = (type: string): void => {
    if (type === "prev") {
      setPage((old) => old - 1);
    } else if (type === "next") {
      setPage((old) => old + 1);
    }
  };

  // Function to navigate to update page
  const updateData = () => {
    navigate("/data/updatedata");
  };

  // Function to reset the search field
  const onClickReset = () => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.value = "";
    }
    setSearchTitle("");
    getData();
  };

  // Use effect to fetch the data initially and every time when searchtitle is empty
  useEffect(() => {
    // setLoading(false);
    getData();
    setPage(searchPage);
  }, []);

  return (
    <>
      {userprofile ? (
        <>
          <Navbar />
          <Alert showAlert={props.showAlert} alert={props.alert} />
          <div className="container container-fluid mt-8 p-0">
            <div className="container d-flex justify-content-between align-items-center my-3 p-0 searchbar">
              <input
                className=" searchbar-input"
                type={"text" || "tel"}
                id="my-input"
                ref={inputRef}
                placeholder="Search by First name,Last name,Email,Mobile number"
                onChange={(e) => {
                  setSearchTitle(e.target.value);
                }}
                onKeyDown={handleKeypress}
              />
              <button
                className="btn btn-primary searchbar-button"
                type="submit"
                onClick={getSearchData}
                disabled={!searchTitle}
              >
                Search
              </button>
              <button
                className="btn btn-danger searchbar-button"
                type="submit"
                onClick={onClickReset}
                disabled={!searchTitle}
              >
                Reset
              </button>
            </div>
            {loading ? (
              <div>
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th scope="col"> Name </th>
                      <th scope="col">First Name </th>
                      <th scope="col">Last Name </th>
                      <th scope="col">Image </th>
                      <th scope="col">Email </th>
                      <th scope="col">Mobile No. </th>
                      <th scope="col">Gender </th>
                      <th scope="col">Date of Birth </th>
                      <th scope="col">About Me </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data &&
                      data.slice(startIndex, endIndex).map((item) => (
                        <tr key={item.id}>
                          <td>
                            {item.firstName} {item.lastName}
                          </td>
                          <td>{item.firstName} </td>
                          <td>{item.lastName} </td>
                          <td>
                            {item.image.includes("google") ? (
                              <img src={item.image} alt="ProfilePic" />
                            ) : (
                              item.image && (
                                <img
                                  src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                                  alt="ProfilePic"
                                />
                              )
                            )}
                          </td>
                          <td>{item.email} </td>
                          <td>{item.Mobile}</td>
                          <td>{item.Gender}</td>
                          <td>
                            {moment(item.DateofBirth).format("DD-MM-YYYY")}
                          </td>
                          <td>{item.aboutme}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Spinner />
            )}
            <div className="my-3">
              <b>Totalusers: {totalResult}</b>
            </div>
            <div className="d-flex justify-content-between footer">
              <button
                className="btn btn-primary"
                onClick={(e) => changePage("prev")}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="pageno">
                <b>
                  page {page} of{" "}
                  {Math.ceil(totalResult / limit)
                    ? Math.ceil(totalResult / limit)
                    : 1}
                </b>
              </span>
              <button
                className="btn btn-primary"
                onClick={(e) => changePage("next")}
                disabled={page + 1 > Math.ceil(totalResult / limit)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {props.showAlert("Please Login to continue", "warning")}
          {navigate("/")}
        </>
      )}
    </>
  );
};

export default Fetchdata;
