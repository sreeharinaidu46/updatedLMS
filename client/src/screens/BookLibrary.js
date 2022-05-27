import React from 'react'
import Moment from 'react-moment';
import moment from 'moment';

const BookLibrary = ({book,index}) => {
  console.log(index)
  var dateFrom;
  var dayDiff;

  if (book) {
    //dateFrom = moment(date + 7 * 24 * 3600 * 1000).format('YYYY-MM-DD');
    var result = new Date(book.createdAt);
    console.log(book.createdAt)
    console.log(result)

    // -15
    result.setDate(result.getDate() + 15);
    dateFrom = result;
    console.log(dateFrom)

    var today = moment(new Date());
    var end = moment(result); // another date
    var duration = moment.duration(today.diff(end));
    var days = duration.asDays();
    dayDiff = days;
  }

  console.log(Math.floor(dayDiff))
  return (
    <>
      <tr key={book._id}>
                <td>{index+1}</td>
                <td>{book.accession_no}</td>
                <td>{book.author}</td>
                <td>Book</td>
                <td>{book.title}</td>
                <td>{<Moment format="YYYY-MM-DD">{book.createdAt }</Moment>}</td>
                <td>{<Moment format="YYYY-MM-DD">{dateFrom}</Moment>}</td>
                <td>{book.return_Count}</td>
                <td>{Math.floor(dayDiff) > 0 ?Math.floor(dayDiff) * 15 : 0 }</td>
              </tr>
    </>
  )
}

export default BookLibrary;
