import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-router-dom";

function Apartments() {
  const [apartment, setApartment] = useState([]);
  const [apartmento, setApartmento] = useState([]);
  const [role, setRole] = useState([]);
  useEffect(() => {
    fetchApartment();
    fetchApartmento();
  }, []);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8081/home')
      .then(res => {
        if (res.data.Status === "Success") {
          setRole(res.data.role);
        }
      })
      .catch(error => {
        console.error('CORS Error:', error);
      });
  }, []);

  const fetchApartmento = () => {
    axios
      .get("http://localhost:8081/apartmentListO")
      .then((response) => {
        setApartmento(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchApartment = () => {
    axios
      .get("http://localhost:8081/apartmentList")
      .then((response) => {
        setApartment(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Apartment?"
    );
    if (confirmed) {
      axios
        .delete(`http://localhost:8081/deleteApartment/${id}`)
        .then((res) => {
          if (res.data.Status === "Success") {
            setApartment(apartment.filter((item) => item._id !== id));
          } else {
            alert("Error");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <div className="container mt-5">
      {role === 'owner' && (
        <Link to="/addapartments" className="btn btn-primary btn-sm float-end">
          Add Apartment
        </Link>
      )}
        <h5 className="p-2">Apartment List</h5>
        <table className="table table-bordered">
          <thead>
            <th>Id</th>
            <th>Name</th>
            <th>Owner Name</th>
            <th>Address</th>
            <th>City</th>
            <th>District</th>
            <th>Rental</th>
            <th>Action</th>
          </thead>
          <tbody>
          {role === 'owner' && (
            <>
            {apartmento.map((x, index) => (
              <tr key={x._id}>
                <td>{index + 1}</td>
                <td>{x.name}</td>
                <td>{x.ownerId.username}</td>
                <td>{x.address}</td>
                <td>{x.city}</td>
                <td>{x.state}</td>
                <td>Rs. {x.rent}/Month</td>
                <td>
                  <Link to={'/oapartmentdetails/'+x._id} className="btn btn-primary btn-sm">Details</Link>
                </td>
              </tr>
            ))}
            </>
            )}
          {role === 'admin' && (
            <>
            {apartment.map((x, index) => (
              <tr key={x._id}>
                <td>{index + 1}</td>
                <td>{x.name}</td>
                <td>{x.ownerId.username}</td>
                <td>{x.address}</td>
                <td>{x.city}</td>
                <td>{x.state}</td>
                <td>Rs. {x.rent}/Month</td>
                <td>
                  <button onClick={() => handleDelete(x._id)} className="btn btn-outline-danger btn-sm float-end">Delete Apartment</button>
                </td>
              </tr>
            ))}
            </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Apartments;
