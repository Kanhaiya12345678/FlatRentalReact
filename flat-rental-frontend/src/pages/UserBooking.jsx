import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from "sweetalert2"

function UserBooking() {
  const [booking, setBooking] = useState([]);
  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = () => {
    axios
      .get("http://localhost:8081/userBooking")
      .then((response) => {
        setBooking(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
 
  const handleCancel = (bookingId) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Are you sure you want to cancel this booking?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            axios
            .put(`http://localhost:8081/cancelBooking/${bookingId}`)
            .then(() => {
                // Reload the bookings after successful cancellation
                fetchBooking();
            })
            .catch((error) => {
                console.error(error);
            });
        }
    })
};
  
  return (
    <>
        <div className="container mt-5">
            <h5 className="p-2">My Booking History</h5>
            <table className="table table-bordered">
            <thead>
                <th>Id</th>
                <th>Booking Date</th>
                <th>Apartment Name</th>
                <th>Owner Name</th>
                <th>Address</th>
                <th>City</th>
                <th>Rental</th> 
                <th>Status</th> 
                <th>Action</th>
            </thead>
            <tbody>
            {booking.map((item, index) => (
              <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.bookingdate.slice(0,10)}</td>
                    <td>{item.apid.name}</td>
                    <td>{item.apid.ownerId.username}</td>
                    <td>{item.apid.address}</td>
                    <td>{item.apid.city}</td>
                    <td>{item.apid.rent}</td>
                    <td>{item.status}</td>
                    {item.status === 'Booked' ? (
                        <td>
                            <button  onClick={e=>handleCancel(item._id)} className="btn btn-danger btn-sm">Cancel Booking</button>
                        </td>
                    ):""}
                </tr>
            ))}
            </tbody>
            </table>
        </div>
    </>
  )
}

export default UserBooking