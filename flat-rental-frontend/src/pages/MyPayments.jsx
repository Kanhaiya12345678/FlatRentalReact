import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MyPayments(){
    const [booking, setBooking] = useState([]);
    const [showPassword, setShowPassword] = useState({});

    useEffect(() => {
        fetchBooking();
      }, []);
    
      const fetchBooking = () => {
        axios
          .get("http://localhost:8081/ownerBooking")
          .then((response) => {
            setBooking(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      };
      const togglePasswordVisibility = (id) => {
        setShowPassword((prevState) => ({
          ...prevState,
          [id]: !prevState[id],
        }));
      };
    return( 
        <>
        <div className="container mt-5">
            <h5 className="p-2">Payment List</h5>
            <table className="table table-bordered">
            <thead>
                <th className="text-center">Id</th>
                <th className="text-center">Payment Date</th>
                <th className="text-center">Customer Name</th>
                <th className="text-center">Card No</th>
                <th className="text-center">Name on Card</th>
                <th className="text-center">Amount</th>
                <th className="text-center">Remarks</th>               
            </thead>
            <tbody>
            {booking.map((item, index) => (
                <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.bookingdate.slice(0,10)}</td>
                    <td>{item.userId.username}</td>
                    <td>
                      {showPassword[item._id] ? item.cardno : "****"}
                      <FontAwesomeIcon
                        icon={showPassword[item._id] ? faEyeSlash : faEye}
                        className="field-icon toggle-password-2 btn btn-primary"
                        onClick={() => togglePasswordVisibility(item._id)}
                      />
                    </td>
                    <td>{item.nameoncard}</td>
                    <td>{item.amount}</td>
                    <td>{item.remark}</td>
                </tr>
            ))}

            </tbody>
            </table>
        </div>
        </>
    )
}