import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import swal from "sweetalert2";

function UserRegister() {
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [aadharNo, setAadharNo] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [adharImage, setAdharImage] = useState(null);
    const [gender, setGender] = useState(null);
    const navigate = useNavigate();
  
    const handleSubmit = (event) => {
      event.preventDefault();

      const formData = new FormData();
      formData.append('username', username);
      formData.append('address', address);
      formData.append('contactNo', contactNo);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('aadharNo', aadharNo);
      formData.append('question', question);
      formData.append('answer', answer);
      formData.append('adharImage', adharImage);
      formData.append('gender', gender);
  
      axios.post('http://localhost:8081/user_register', formData)
        .then((result) => {
          navigate('/login');
          swal.fire({
            position: "center",
            icon: "success",
            title: "Email registered successfully",
          });
        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            swal.fire({
                position: "center",
                icon: "error",
                title: "Email already registered",
              });
            console.log(err.response.data.error);
          } else {
            console.log('Registration failed');
          }
        });
    };
  
    const handleImageChange = (event) => {
      setAdharImage(event.target.files[0]);
    };
  
    
  return (
    <>
<div className="container mt-5">
      <div className="title">User Registration Form</div>
      <form>
        <div className="user-details">
          <div className="input-box">
            <span className="details">Full Name</span>
            <input
              type="text"
              placeholder="Enter your name"
              id="firstName"
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Address</span>
            <input
              type="text"
              placeholder="Enter your address"
              id="emailid"
              onChange={e=>setAddress(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Mobile Number</span>
            <input
              type="text"
              maxLength={10}
              minLength={10}
              placeholder="Enter your number"
              id="mobileNo"
              onChange={e => setContactNo(e.target.value)}
              required
            />
          </div>
          
          
          <div className="input-box">
            <span className="details">Email</span>
            <input
              type="email"
              placeholder="Enter your email"
              id="emailid"
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              id="password"
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Aadhar Number</span>
            <input
              type="email"
              placeholder="Enter your adhar number"
              minLength={12}
              maxLength={12}
              onChange={e => setAadharNo(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Security Question</span>
            <select
              onChange={e=>setQuestion(e.target.value)}
              required
            >
              <option>Select Security Question</option>
              <option>What is your nick name ?</option>
              <option>Which is your favorite pet name ?</option>
            </select>
          </div>
          <div className="input-box">
            <span className="details">Answer</span>
            <input
              type="text"
              placeholder="Enter your Answer"  
              onChange={e=>setAnswer(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Adhar Card Photo</span>
            <input
              type="file"
              className="form-control"
              placeholder="Upload Aadhar Card"
              id="formFileSm"
              accept=".jpg,.png,.jpeg"
              onChange={handleImageChange}
              required
            />
          </div>
        </div>
        <div className="gender-details">
          <input
            type="radio"
            name="gender"
            id="dot-1"
            value="Male"
            checked={gender === "Male"}
            onChange={(e) => setGender(e.target.value)} />
          <input
            type="radio"
            name="gender"
            id="dot-2"
            value="Female"
            checked={gender === "Female"}
            onChange={(e) => setGender(e.target.value)}
          />
          <input
            type="radio"
            name="gender"
            id="dot-3"
            value="NA"
            checked={gender === "NA"}
            onChange={(e) => setGender(e.target.value)}
          />
          <span className="gender-title">Gender</span>
          <div className="category">
            <label htmlFor="dot-1">
              <span className="dot one"></span>
              <span className="gender">Male</span>
            </label>
            <label htmlFor="dot-2">
              <span className="dot two"></span>
              <span className="gender">Female</span>
            </label>
            <label htmlFor="dot-3">
              <span className="dot three"></span>
              <span className="gender">Prefer not to say</span>
            </label>
          </div>
        </div>
        <div className="button">
          <input type="submit" className="bg-info bg-gradient" value="Submit" onClick={handleSubmit} />
        </div>
      </form>
    </div>
    </>
  )
}

export default UserRegister