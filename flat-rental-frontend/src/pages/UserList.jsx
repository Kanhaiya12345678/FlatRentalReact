import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UserList() {
  const [showPassword, setShowPassword] = useState({});
  const [showPassword1, setShowPassword1] = useState({});
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    axios
      .get("http://localhost:8081/userList") // Corrected endpoint URL
      .then((response) => {
        setUser(response.data);
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
        .delete(`http://localhost:8081/deleteUser/${id}`)
        .then((res) => {
          if (res.data.Status === "Success") {
            setUser(user.filter((item) => item._id !== id));
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
        <h5 className="p-2">User List</h5>
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
            {user.map((x, index) => (
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
                  <Link to={`/udetails/${x._id}`} className="btn btn-primary btn-sm">
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

export default UserList;
