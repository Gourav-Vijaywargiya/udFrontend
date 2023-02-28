import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { user, datatype, userProfile } from "../Interface/common";
import Navbar from "./Navbar";

const Fetchdata = () => {
  const userProfile: userProfile = JSON.parse(
    localStorage.getItem("profile") as string
  );

  const [data, setData] = useState<user[] | null>([]);
  const [page, setPage] = useState<number>(1);
  const [totalResult, setTotalResult] = useState<number>(0);
  const [searchTitle, setSearchTitle] = useState<string | number>("");
  const limit: number = 2;
  const navigate = useNavigate();
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const [searchPage, setSearchPage] = useState<number>(1);


  // Funtion to get complete data
  const getData = async () => {
    setPage(searchPage);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/fetchdata`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let temp: datatype = await response.json();
    setData(temp.User);
    setTotalResult(Number(temp.totalResults));
  };


  // Function to get searched data
  const getSearchData = async () => {
    setSearchPage(page);
    setPage(1);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/fetchsearchdata/${searchTitle}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let temp: datatype = await response.json();
    setData(temp.User);
    setTotalResult(Number(temp.totalResults));
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

  // Use effect to fetch the data initially and every time when searchtitle is empty
  useEffect(() => {
    if (searchTitle === "") {
      getData();
      setPage(searchPage);
    }
  }, [searchTitle]);

  
  return (
    <>
      <Navbar  />
      <div className="container container-fluid mt-8 p-0" >
        <div
          className="container d-flex justify-content-between align-items-center my-3 p-0"
          
        >
          <input
            type={"text" || "tel"}
            placeholder="Search Here"
            onChange={(e) => {
              setSearchTitle(e.target.value);
            }}
            style={{ width: "1200px", height: "50px", padding: "15px" }}
          />
          <button
            className="btn btn-primary "
            type="submit"
            style={{ width: "100px", height: "50px" }}
            onClick={getSearchData}
          >
            <i className="bi bi-search"></i>Search
          </button>
        </div>

        <table
          className="table table-bordered table-hover"
          style={{ borderColor: "ActiveBorder" }}
        >
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
              <th scope="col">Last login time</th>
            </tr>
          </thead>

          <tbody style={{ backgroundColor: "#F0F8FF" }}>
            {data &&
              data.slice(startIndex, endIndex).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.firstName} </td>
                  <td>{item.lastName} </td>
                  <td>
                    {item.image.includes("google") ? (
                      <img
                        style={{ width: "100px", height: "80px" }}
                        src={item.image}
                        alt="ProfilePic"
                      />
                    ) : (
                      <img
                        style={{ width: "100px", height: "80px" }}
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                        alt="ProfilePic"
                      />
                    )}
                  </td>
                  <td>{item.email} </td>
                  <td>{item.Mobile}</td>
                  <td>{item.Gender}</td>
                  <td>{item.DateofBirth.slice(0, 10)}</td>
                  <td>{item.aboutme}</td>
                  <td>{item.lastlogin.slice(0, 24)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div
          className="d-flex justify-content-between"
          style={{ width: "100%" }}
        >
          <button
            className="btn btn-primary"
            onClick={(e) => changePage("prev")}
            disabled={page === 1}
          >
            Previous
          </button>

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
  );
};

export default Fetchdata;
