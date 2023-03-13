import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { IUser, IDatatype, IUserProfile, iProps } from '../Interface/common';
import Alert from './Alert';
import Navbar from './Navbar';
import Spinner from './Spinner';
import moment from 'moment';

const Fetchdata = (props: iProps) => {
  const userprofile: IUserProfile = JSON.parse(
    localStorage.getItem('userprofile') as string
  );
  const [userData, setUserData] = useState<IUser[] | null>([]);
  const [page, setPage] = useState<number>(1);
  const [totalResult, setTotalResult] = useState<number>(0);
  const [searchTitle, setSearchTitle] = useState<string | number>('');
  const limit: number = 5;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [reset,setReset] = useState<number>(1);

  // Funtion to get complete data
  const getData = async () => {
    // setPage(searchPage);
    setLoading(false);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL }/data/fetchdata?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    let tempuser: IDatatype = await response.json();
    setLoading(true);
    setUserData(tempuser.User);
    setTotalResult(Number(tempuser.totalResults));
  };

  // Function to get searched data
  const getSearchData = async () => {
    setLoading(false);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/data/fetchsearchdata/${searchTitle}?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    let temp: IDatatype = await response.json();
    if (temp.User.length > 0) {
      props.showAlert('User found', 'info');
    } else {
      props.showAlert('User not found', 'info');
    }
    setLoading(true);
    setUserData(temp.User);
    setTotalResult(Number(temp.totalResults));
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if(page ===1){
        getSearchData();
      }
      else{
        setPage(1);
      }
    }
  };

  // funtion to change page number according to pagination
  const changePage = (type: string): void => {
    if (type === 'prev') {
      setPage((old) => old - 1);
    } else if (type === 'next') {
      setPage((old) => old + 1);
    }
  };


   // Function to call search data
   const onClickSearch = () =>{
    if(page ===1){
      getSearchData();
    }
    else{
      setPage(1);
    }
  }

  // Function to reset the search field
  const onClickReset = () => {
    setPage(1);
    setReset((old) => old + 1);
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.value = '';
    }
    setSearchTitle('');
  };

  // Use effect to fetch the data initially and every time when searchtitle is empty
  useEffect(() => {
    if(searchTitle === ''){

      getData();
  }
  else{
      getSearchData();
  }
  }, [page,reset]);

  return (
    <>
      {userprofile ? (
        <>
          <Navbar />
          <Alert showAlert={props.showAlert} alert={props.alert} />
          <div className='container container-fluid mt-8 p-0'>
            <div className='container d-flex justify-content-between align-items-center my-3 p-0 searchbar'>
              <input
                className=' searchbar-input'
                type={'text' || 'tel'}
                id='my-input'
                ref={inputRef}
                placeholder='Search by First name,Last name,Email,Mobile number'
                onChange={(e) => {
                  setSearchTitle(e.target.value);
                }}
                onKeyDown={handleKeypress}
              />
              <button
                className='btn btn-primary searchbar-button'
                type='submit'
                onClick={onClickSearch}
                disabled={!searchTitle}
              >
                Search
              </button>
              <button
                className='btn btn-danger searchbar-button'
                type='submit'
                onClick={onClickReset}
                disabled={!searchTitle}
              >
                Reset
              </button>
            </div>
            {loading ? (
              <div className='scrollabletable'>
                <table className='table table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th scope='col'> Name </th>
                      <th scope='col'>First Name </th>
                      <th scope='col'>Last Name </th>
                      <th scope='col'>Image </th>
                      <th scope='col'>Email </th>
                      <th scope='col'>Mobile No. </th>
                      <th scope='col'>Gender </th>
                      <th scope='col'>Date of Birth </th>
                      <th scope='col'>About Me </th>
                    </tr>
                  </thead>

                  <tbody>
                    {userData &&
                      userData.map((item) => (
                        <tr key={item.id}>
                          <td>
                            {item.firstName} {item.lastName}
                          </td>
                          <td>{item.firstName} </td>
                          <td>{item.lastName} </td>
                          <td>
                            {item.image.includes('google') ? (
                              <img src={item.image} alt='ProfilePic' />
                            ) : (
                              item.image && (
                                <img
                                  src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                                  alt='ProfilePic'
                                />
                              )
                            )}
                          </td>
                          <td>{item.email} </td>
                          <td>{item.Mobile}</td>
                          <td>{item.Gender}</td>
                          <td>
                            {moment(item.DateofBirth).format('DD-MM-YYYY')}
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
            <div className='my-3'>
              <b>Totalusers: {totalResult}</b>
            </div>
            <div className='d-flex justify-content-between footer'>
              <button
                className='btn btn-primary'
                onClick={(e) => changePage('prev')}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className='pageno'>
                <b>
                  page {page} of{' '}
                  {Math.ceil(totalResult / limit)
                    ? Math.ceil(totalResult / limit)
                    : 1}
                </b>
              </span>
              <button
                className='btn btn-primary'
                onClick={(e) => changePage('next')}
                disabled={page + 1 > Math.ceil(totalResult / limit)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {props.showAlert('Please Login to continue', 'warning')}
          {navigate('/')}
        </>
      )}
    </>
  );
};

export default Fetchdata;
