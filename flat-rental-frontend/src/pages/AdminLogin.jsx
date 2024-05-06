import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import "../components/login.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8081/admin_login', { username, password })
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
            icon: "error",
            title: "Oops...",
            text: "Please enter valid details!",
          });
        }
      })
      .catch(err => {
        console.log(err);
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please enter valid details!",
        });
      });
  };

  return (
    <div>
      <div className="center border border-4 border-primary">
        <h5 className="p-3 text-center bg-info rounded-top bg-gradient text-white">Admin Login</h5>
        <form>
          <div className="txt_field">
            <input
              name="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
            <span></span>
            <label>Admin Id</label>
          </div>
          <div className="txt_field">
            <input
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span></span>
            <label>Password</label>
          </div>
          <br />
          <input
            type="submit"
            value="Login"
            onClick={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
