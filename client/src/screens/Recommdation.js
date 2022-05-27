// import React,{useState,useEffect} from 'react';
// import {getAllBookIssueReq ,issuedReq,issuedReqDeletedByAdmin} from "../actions/Issue_action"
// import {addOneBook} from "../actions/book_action"
// import { useDispatch, useSelector } from 'react-redux'

// const RecomBook = () => {

//     const dispatch = useDispatch() ;

//     useEffect(()=> {
//         dispatch(getAllBookIssueReq())
//     },[])

//     const {issuebooks} = useSelector(state => state.getAllIssueBookReqReducer)
//     const newIssuedBook = issuebooks && issuebooks.filter(item => item.isRecom)

//     const handleAccerpt = (book)=> {
//        dispatch(addOneBook(book))
//     }

//     return (
//         <div className="col-md-10 m-auto">
//             <p style={{fontFamily:"sans-serif",fontSize:"30px",textAlign:"center",padding:"10px"}}>Recommended By Student</p>
//             <table  className='table table-bordered table-responsive-sm'>

// <thead className='thead-dark'>
//     <tr>
//     <th>Serial No.</th>
//         <th>Book Name</th>
//         <th>Author</th>
//         <th>Requested  Student </th>
//         <th>Student Branch</th>
//         <th>Actions</th>
//     </tr>
// </thead>
// <tbody>

// {newIssuedBook && newIssuedBook.map((book,index)=>{

//     return <tr key={book._id}>
//           <td>{index+1}</td>
//         <td>{book.title}</td>
//         <td>
//             {book.author}
//         </td>
//         <td>
//             {book.userName}
//         </td>
//         <td>
//             {book.userBranch}
//         </td>

//         <td>

//         <button onClick={() => handleAccerpt(book)} className="btn btn-success">Accept</button>
//              <button onClick={() => dispatch(issuedReqDeletedByAdmin(book._id))} className="btn btn-danger">Deleted</button>
//         </td>

//     </tr>

// })}
// </tbody>

// </table>
//         </div>
//     );
// };

// export default RecomBook;
// () => dispatch(getOneBook(access_no))
import React, { useState, useEffect } from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import {getAllBookIssueReq ,issuedReq,issuedReqDeletedByAdmin} from "../actions/Issue_action"
import { filterBook, getOneBook } from "../actions/book_action";
import { getAllIssuedBook, issueABookByAdmin,BookIsuueDeletedByAdmin,BookRenewByAdmin } from "../actions/Issue_action";
import { getStudentDetails } from "../actions/user_action";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import moment from "moment";
import BookLibrary from "./BookLibrary";
import "./Issues.css";
const RecomBook = () => {
  const dispatch = useDispatch();
  const [access_no, setAcess] = useState("");
  const [member_id, setMember] = useState("");
  const [cleared,isCleared]=useState(false);
  // const [issueEnable,issueEnableFunction]=useState(false);
  // const [returnEnable,returnEnableFunction]=useState(false);
  let issueEnable = false;
  let returnEnable = false;
  const { bookItem } = useSelector((state) => state.getOneBookReducer);
  const { userDetails } = useSelector(
    (state) => state.getStudentDetailsReducer
  );
  const { all_IssuedBook } = useSelector((state) => state.allIssuedBookReducer);
  let filterBooks;
  if (Object.keys(userDetails).length > 0) {
    filterBooks =
      all_IssuedBook &&
      all_IssuedBook.filter((book) => book.userId == userDetails._id);
  }

  // var dateFrom;
  // var dayDiff;

  // if (filterBooks) {
  //   //dateFrom = moment(date + 7 * 24 * 3600 * 1000).format('YYYY-MM-DD');
  //   var result = new Date(filterBooks.createdAt);
  //   console.log(filterBooks.createdAt)
  //   console.log(result)
  //   result.setDate(result.getDate() + 15);
  //   dateFrom = result;
  //   console.log(dateFrom)

  //   var today = moment(new Date());
  //   var end = moment(result); // another date
  //   var duration = moment.duration(today.diff(end));
  //   var days = duration.asDays();
  //   dayDiff = days;
  // }
  if (Object.keys(userDetails).length > 0 && Object.keys(bookItem).length > 0) {
    const dataBooks =
      filterBooks && filterBooks.filter((book) => book.bookId == bookItem._id);
    console.log(dataBooks);
    if (dataBooks.length > 0) {
      console.log("wfjkhs");
      issueEnable = false;
      returnEnable = true;
    } else {
      if(bookItem.copies>0){
        issueEnable = true;
      }
      returnEnable = false;
    }
  } else {
    issueEnable = false;
    returnEnable = false;
  }
  console.log(filterBooks);

  console.log(all_IssuedBook);
  console.log(Object.keys(userDetails).length === 0);
  console.log(userDetails);
  console.log(bookItem);
  console.log(Object.keys(bookItem).length === 0);
  
  const readBookDetails = () => {
    // setAcess("");
    // isCleared(true);
    dispatch(getOneBook(access_no));
  };

  const getMemberId = () => {
    // setMember("");
    // isCleared(true);
    dispatch(getStudentDetails(member_id));
    dispatch(getAllIssuedBook());
  };
  //   const issueUser = {
  //     accession_no,title,author,publisher,year,userId,bookId:_id,userBranch,userName,copies
  // }

  const issueHandler = () => {
    dispatch(getAllIssuedBook());
    getMemberId();
    var userId = userDetails._id;
    var userName = userDetails.name;
    const userBranch = userDetails.branch;
    const { accession_no, title, author, publisher, year, _id, copies } =
      bookItem;
    const issueUser = {
      accession_no,
      title,
      author,
      publisher,
      year,
      userId,
      bookId: _id,
      userBranch,
      userName,
      copies,
    };

    dispatch(issueABookByAdmin(issueUser));
    getMemberId();
    dispatch(getAllIssuedBook());
  };

  const returnReqHandler=()=>{
    dispatch(getAllIssuedBook());
    dispatch(BookIsuueDeletedByAdmin(userDetails._id,bookItem._id));
    dispatch(getAllIssuedBook());
  }

  const renewReqHandler=()=>{
    dispatch(getAllIssuedBook());
    dispatch(BookRenewByAdmin(userDetails._id,bookItem._id));
    dispatch(getAllIssuedBook());

  }

  const clearReqHandler=()=>{
    setAcess("");
    setMember("");
    // isCleared(false);
    dispatch(getOneBook(""));
    dispatch(getStudentDetails(""));
    dispatch(getAllIssuedBook());

  }
  console.log(returnEnable);
  console.log(issueEnable);

  return (
    <>
      <div className="wrapper">
        <div className="left">
          <label htmlFor="book_id" className="book_label">
            Accession No
          </label>
          <input
            type="text"
            id="book_id"
            style={{ width: "50%" }}
            placeholder="Please Enter Accession No"
            value={access_no}
            onChange={(e) => setAcess(e.target.value)}
          />
          <button type="button" onClick={readBookDetails}>
            Read
          </button>
          <button type="button" onClick={() => setAcess("")}>
            Clear
          </button>

          <div className="book_details">
            <h5>Book Details</h5>
          </div>

          {Object.keys(bookItem).length > 0 && (
            <div className="item_detailss">
              <p>
                Accession
                No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>{bookItem.accession_no}</span>
              </p>
              <p>
                Item
                Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>Book</span>
              </p>
              <p>
                Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>{bookItem.title}</span>
              </p>
              <p>
                Author
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>{bookItem.author}</span>
              </p>
              <p>
                Call
                Num&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>{bookItem.call_no}</span>
              </p>
              <p>
                Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>Main Library Books</span>
              </p>
              <p>
                Location&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>null</span>
              </p>
            </div>
          )}
        </div>
        <div style={{ position: "absolute", top: "29%", left: "40%" }}>
          <div className="issue_buttons">
            <button
              type="button"
              style={{ backgroundColor: "green" }}
              disabled={!issueEnable}
              onClick={issueHandler}
              className={!issueEnable&&'disabledClass'}
            >
              Issue
            </button>
            <button
              type="button"
              style={{ backgroundColor: "orange" }}
              disabled={!returnEnable}
              onClick={returnReqHandler}
              className={!returnEnable&&'disabledClass'}
            >
              Return
            </button>
            <button
              type="button"
              style={{ backgroundColor: "blue" }}
              disabled={!returnEnable}
              onClick={renewReqHandler}
              className={!returnEnable&&'disabledClass'}
            >
              Renewal
            </button>
            <button type="button" style={{ backgroundColor: "orange" }} onClick={clearReqHandler}>
              Clear
            </button>
          </div>
        </div>
        <div className="right">
          <label htmlFor="book_id" className="book_label">
            Member Id
          </label>
          <input
            type="text"
            id="book_id"
            style={{ width: "50%" }}
            placeholder="Please Enter the Member Id"
            value={member_id}
            onChange={(e) => setMember(e.target.value)}
          />
          <button type="button" onClick={getMemberId}>
            Read
          </button>
          <button type="button">Clear</button>

          <div className="book_details">
            <h5>Member Details</h5>
          </div>
          {Object.keys(userDetails).length > 0 && (
            <div className="item_detailss">
              <p>
                Member
                Id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <span style={{ color: "red" }}>{userDetails.roll_no}</span>
              </p>
              <p>
                Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <span style={{ color: "red" }}>{userDetails.name}</span>
              </p>
              <p>
                Profile&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <span style={{ color: "red" }}>Student</span>
              </p>
              <p>
                Department&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <span style={{ color: "red" }}>{userDetails.branch}</span>
              </p>
              <p>
                Course&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>null</span>
              </p>
              <p>
                Branch&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>null</span>
              </p>
              <p>
                Roll
                No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>0</span>
              </p>
              <p>
                Remarks&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "red" }}>null</span>
              </p>
            </div>
          )}
        </div>
      </div>
      {/* {filterBooks && filterBooks.map((book,index)=>{
        <BookLibrary key={book._id} book={book}/>
      })} */}

      <div className="down_container">
        <div className="col-md-12 m-auto">
          <h5
            style={{
              fontFamily: "sans-serif",
              textAlign: "center",
              padding: "5px",
              fontStyle: "oblique",
              color: "#003300",
            }}
          >
            List of the Items Issued to the Member
          </h5>
          <table className="table table-bordered table-responsive-sm">
            <thead className="thead-dark">
              <tr style={{ backgroundColor: "#00ccff" }}>
                <th>Seq</th>
                <th>Accn No</th>
                <th>Author</th>
                <th>Item Type/Category</th>
                <th>Description</th>
                <th>Issue date</th>
                <th>Due date</th>
                <th>Renewed</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {filterBooks &&
                filterBooks.map((book, index) => {
                  {
                    /* return <tr key={book._id}>
                <td>hello</td>
                <td>{book.accession_no}</td>
                <td>{book.author}</td>
                <td>Book</td>
                <td>{book.title}</td>
                <td>{<Moment format="YYYY-MM-DD">{book.createdAt }</Moment>}</td>
                <td>{<Moment format="YYYY-MM-DD">{dateFrom}</Moment>}</td>
                <td>{Math.floor(dayDiff) > 0 ?Math.floor(dayDiff) * 15 : 0 }</td>
                <td></td>
              </tr> */
                  }

                  return (
                    <BookLibrary key={book._id} book={book} index={index} />
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RecomBook;
