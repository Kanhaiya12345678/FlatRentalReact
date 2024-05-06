import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";
import aptvideo from "./video/aptvideo.mp4";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8081/userLogin', { email, password })
    .then(result => { 
      console.log(result);
      if (result.data.message === "Login successful") {
        navigate('/');
        swal.fire({
          position: "center",
          icon: "success",
          title: `Welcome, ${result.data.username}`,
        }).then(() => {
          window.location.reload();
        });
      } else {
        swal.fire({
          position: "center",
          icon: "error",
          title: "Invalid email or password",
        });
      }
    })
    .catch(err => {
      console.log(err);
      swal.fire({
        position: "center",
        icon: "error",
        title: "Invalid email or password",
      });
    });
    };

  return (
    <div>
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          width: "100%",
          left: "50%",
          top: "50%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%,-50%)",
          zIndex: "-1",
        }}
      >
        <source src={aptvideo} type="video/mp4" />
      </video>
      <div className="center">
        <h5 className="p-3 text-center bg-info rounded-top bg-gradient text-white">
          Login
        </h5>
        <form>
          <div className="txt_field">
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span></span>
            <label>Email Id</label>
          </div>
          <div className="txt_field">
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span></span>
            <label>Password</label>
          </div>
          <Link to="/reset-password" className="pass d-block">
            Forgot Password?
          </Link>
          <br />
          <input type="submit" value="Login" onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
}

export default Login;
