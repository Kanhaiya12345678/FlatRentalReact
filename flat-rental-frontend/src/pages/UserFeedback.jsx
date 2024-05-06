import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserFeedback() {
  const [feedback, setFeedback] = useState({
    description: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post('http://localhost:8081/addFeedback', feedback);
      alert('Feedback Added Successfully');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to add feedback. Please try again.');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 mx-auto" style={{ width: '500px' }}>
            <h5>Feedback Form</h5>
            <form onSubmit={handleSubmit}>
              <div>
                <div className="mb-3">
                  <textarea
                    rows={5}
                    placeholder="Your feedback here"
                    name="description"
                    value={feedback.description}
                    onChange={handleInputChange}
                    className="form-control"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary float-end">
                  Submit Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserFeedback;
