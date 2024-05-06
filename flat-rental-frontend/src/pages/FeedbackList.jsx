import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function FeedbackList() {
  const [showPassword, setShowPassword] = useState({});
  const [showPassword1, setShowPassword1] = useState({});
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = () => {
    axios
      .get("http://localhost:8081/feedbackList")
      .then((response) => {
        setFeed(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Feed?"
    );
    if (confirmed) {
      axios
        .delete(`http://localhost:8081/deleteFeed/${id}`)
        .then((res) => {
          if (res.data.Status === "Success") {
            setFeed(feed.filter((item) => item._id !== id));
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
        <h5 className="p-2">Users Feedbacks</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>User Name</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Feedback</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {feed.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.userId.username}</td>
                <td>{item.userId.gender}</td>
                <td>
                  {showPassword[item._id] ? item.userId.email : "********"}
                    <FontAwesomeIcon
                      icon={showPassword[item._id] ? faEyeSlash : faEye}
                      className="field-icon toggle-password-2 btn btn-primary"
                      onClick={() => togglePasswordVisibility(item._id)}
                    />
                </td>
                <td>
                    {showPassword1[item._id] ? item.userId.contactNo : "********"}
                    <FontAwesomeIcon
                      icon={showPassword1[item._id] ? faEyeSlash : faEye}
                      className="field-icon toggle-password-2 btn btn-primary"
                      onClick={() => togglePasswordVisibility1(item._id)}
                    />
                </td>
                <td>{item.description}</td>
                <td>{item.date.slice(0, 10)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FeedbackList;
