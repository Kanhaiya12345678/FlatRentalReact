import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function OwnerList() {
  const [showPassword, setShowPassword] = useState({});
  const [showPassword1, setShowPassword1] = useState({});
  const [owner, setOwner] = useState([]);

  useEffect(() => {
    fetchOwner();
  }, []);

  const fetchOwner = () => {
    axios
      .get("http://localhost:8081/ownerList") // Corrected endpoint URL
      .then((response) => {
        setOwner(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Owner?"
    );
    if (confirmed) {
      axios
        .delete(`http://localhost:8081/deleteOwner/${id}`)
        .then((res) => {
          if (res.data.Status === "Success") {
            setOwner(owner.filter((item) => item._id !== id));
          } else {
            alert("Error");
          }
        })
        .catch((err) => console.log(err));
    }
  };
 
  const togglePasswordVisibility = (id) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const togglePasswordVisibility1 = (id) => {
    setShowPassword1((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  
  return (
    <>
      <div className="container mt-5">
        <h5 className="p-2">Owner List</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Gender</th>
              <th>User Id</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {owner.map((x, index) => (
              <tr key={x._id}>
                <td>{index + 1}</td>
                <td>{x.username}</td>
                <td>{x.gender}</td>
                <td>
                  {showPassword[x._id] ? x.email : "********"}
                    <FontAwesomeIcon
                      icon={showPassword[x._id] ? faEyeSlash : faEye}
                      className="field-icon toggle-password-2 btn btn-primary"
                      onClick={() => togglePasswordVisibility(x._id)}
                    />
                </td>
                <td>{x.address}</td>
                <td>
                  {showPassword1[x._id] ? x.contactNo : "********"}
                    <FontAwesomeIcon
                      icon={showPassword1[x._id] ? faEyeSlash : faEye}
                      className="field-icon toggle-password-2 btn btn-primary"
                      onClick={() => togglePasswordVisibility1(x._id)}
                    />
                </td>
                <td>{x.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <Link to={`/odetails/${x._id}`} className="btn btn-primary btn-sm">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OwnerList;
