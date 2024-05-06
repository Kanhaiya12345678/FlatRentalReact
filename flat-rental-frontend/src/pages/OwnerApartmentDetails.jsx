import axios from "axios";
import { Carousel } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function OwnerApartmentDetails() {
  const [apartment, setApartment] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [booking, setBooking] = useState([]);
  const { id } = useParams();
  
  const fetchBooking = () => {
    axios
      .get(`http://localhost:8081/bookingUserList/${id}`)
      .then((response) => {
        setBooking(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
    
  useEffect(() => {
    const fetchApartmentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/apartmentDetails/${id}`
        );
        setApartment(response.data);
      } catch (error) {
        console.error("Error fetching apartment details:", error);
      }
    };
    
    fetchBooking();
    fetchApartmentDetails();
  }, [id]);

  const togglePasswordVisibility = (id) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
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
  const handleBooked = (bookingId) => {
      Swal.fire({
          title: 'Are you sure?',
          text: 'Are you sure you want to booked this Apartment?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: 'success',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, booked it!'
      }).then((result) => {
          if (result.isConfirmed) {
              axios
                  .put(`http://localhost:8081/bookedBooking/${bookingId}`)
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
  const toggleApartmentStatus = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Are you sure you want to book this Apartment?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: 'success',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, book it!'
      });
      if (result.isConfirmed) {
        const response = await axios.put(`http://localhost:8081/toggleApartmentStatus/${id}`);
        setApartment(response.data);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error toggling Apartment status:", error);
    }
  };
  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-5">
            <button onClick={toggleApartmentStatus} className={`btn ${apartment?.active ? 'btn-outline-danger' : 'btn-primary'} float-end`}>
                {apartment?.active ? 'Deactivate Apartment' : 'Activate Apartment'}
            </button>
            <h5>Apartment Details</h5>
            <div className="card" style={{ width: "28rem" }}>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={`http://localhost:8081/images/` + apartment.pic1}
                    height={300}
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={`http://localhost:8081/images/` + apartment.pic2}
                    height={300}
                    alt="Second slide"
                  />
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={`http://localhost:8081/images/` + apartment.pic3}
                    height={300}
                    alt="Third slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={`http://localhost:8081/images/` + apartment.pic4}
                    height={300}
                    alt="Fourth slide"
                  />
                </Carousel.Item>
              </Carousel>
              <div className="card-body">
                <h5 className="card-title">{apartment?.name}</h5>
                <h6>
                  {apartment?.address}, {apartment?.city} {apartment?.state}
                </h6>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">₹ {apartment?.rent}/month</li>
                <li className="list-group-item">
                  For {apartment?.gender} only
                </li>
                <li className="list-group-item">{apartment?.furnish}</li>
                <li className="list-group-item">{apartment?.atype}</li>
              </ul>
              <div className="card-body">
                Owner : {apartment?.ownerId?.username}
              </div>
            </div>
          </div>
          <div style={{ marginLeft: '480px', marginTop:"-620px" }} className="col-sm-7">
            <h5 className="p-2">Users List</h5>
            <table className="table table-bordered">
              <thead>
                <th>Id</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </thead>
              <tbody>
              {booking.map((x, index) => (
                <tr key={x.id}>
                <td>{index + 1}</td>
                <td>{x.userId.username}</td>
                <td>{x.userId.gender}</td>
                <td>{x.userId.address}</td>
                <td>
                    {showPassword[x._id] ? x.userId.contactNo : "********"}
                      <FontAwesomeIcon
                        icon={showPassword[x._id] ? faEyeSlash : faEye}
                        className="field-icon toggle-password-2 btn btn-primary"
                        onClick={() => togglePasswordVisibility(x._id)}
                      />
                </td>
                <td>{x.status}</td>
                <td>
                  {x.status === 'Booked' && (
                    <button onClick={() => handleCancel(x._id)} className="btn btn-danger btn-sm">
                      Cancel Booking
                    </button>
                  )}
                  {x.status === 'Cancelled' && (
                    <button onClick={() => handleBooked(x._id)} className="btn btn-success btn-sm">
                      Booked Apartment
                    </button>
                  )}
                </td>
                </tr>
               ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
