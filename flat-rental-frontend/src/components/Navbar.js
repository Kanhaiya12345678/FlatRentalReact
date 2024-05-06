import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./3.css";
import Footer from "./Footer";
import axios from "axios";
import swal from "sweetalert2";
import { Nav, NavDropdown } from 'react-bootstrap';

export default function Navbar() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [active, setActive] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8081/home")
      .then((result) => {
        console.log(result);
        if (result.data && result.data.Status === "Success") {
          setUserRole(result.data.role);
          setUsername(result.data.username);
          setActive(result.data.active === true);
          console.log('Updated username state:', result.data.active);
        } else {
          setUserRole(null);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8081/logout")
      .then((res) => {
        setUserRole(null);
        setUsername(null);
        swal.fire({
          title: "Oops...",
          text: "Log-Out Successfully !",
        }).then(() => {
          window.location.reload();
        });
        navigate("/");
      })
      .catch((err) => console.log(err));
  }; 

    const [gender,setGender]=useState('All')
    const [atype,setAtype]=useState('All')
    const [furnish,setFurnish]=useState('All')
    const handleSearch = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.get("http://localhost:8081/search", {
          params: {
            gender: gender,
            atype: atype,
            furnish: furnish,
          },
        });
    
        if (response.data.status === 'Success') {
          console.log("Search Results:", response.data.results);
          navigate('/search-results', { state: { results: response.data.results } });
        } else {
          console.error("Search Error:", response.data.message);
          navigate('/search-results', { state: { results2: response.data.message } });
        }
      } catch (error) {
        console.error("Search Error:", error);
      }
    };

  return (
    <>
    <div style={{backgroundColor: '#5595f4'}}>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary bg-gradient text-black fw-bold opacity-75">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">Flat Rental</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/"><i className="fa fa-home"> Home</i></Link>
              </li>
              {!userRole && (
                <>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/login"><i className="fa fa-sign-in"> Login</i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/admin_login"><i className="fa fa-sign-in"> Admin Login</i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/cregister"><i className="fa fa-registered"> User Register</i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/oregister"><i className="fa fa-registered"> Owner Register</i></Link>
                </li>
              </>
              )}
              
              {userRole === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/owners"><i className="fa fa-group"> Owners</i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/users"><i className="fa fa-group"> Users</i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/apartments"><i className="fa fa-address-book"> Apartments</i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/feedbacks"><i className="fa fa-comment"> Feedbacks</i></Link>
                </li>
                <Nav className="navbar-nav ml-auto">
                  <NavDropdown title={<i className="fa fa-user-circle-o" style={{ color: "whitesmoke" }}> Hi! {username}</i>} id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/admin-change"><i className="fa fa-key"> Change Password</i></NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
              )}
              {userRole === "user" && active && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/cbooking"><i className="fa fa-id-card"> Bookings</i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/sendfeedback"><i className="fa fa-comment"> Feedback</i></Link>
                </li>
                <Nav className="navbar-nav ml-auto">
                  <NavDropdown title={<i className="fa fa-gear" style={{ color: "whitesmoke" }}> Hi! {username}</i>} id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/cprofile"><i className="fa fa-user-circle-o"> User Profile</i></NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/user-change"><i className="fa fa-key"> Change Password</i></NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
              )}
              {userRole === "owner" && active && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/apartments"><i className="fa fa-id-card"> Apartments</i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/myUsers"><i className="fa fa-group"> Users</i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/myPayments"><i className="fa fa-credit-card"> Payments</i></Link>
                </li>
                <Nav className="navbar-nav ml-auto">
                  <NavDropdown title={<i className="fa fa-gear" style={{ color: "whitesmoke" }}> Hi! {username}</i>} id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/oprofile"><i className="fa fa-user-circle-o"> User Profile</i></NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/owner-change"><i className="fa fa-key"> Change Password</i></NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
              )}
              {userRole && (
                <>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" onClick={handleLogout}><i className="fa fa-power-off"> Logout</i></Link>
                </li>
            </>
            )}
            </ul>
            <form className="d-flex">
              <select className="form-control me-1" onChange={(e) => setAtype(e.target.value)}>
                <option value="All">All Types</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="2 RK">2 RK</option>
              </select>
              <select className="form-control me-1" onChange={(e) => setGender(e.target.value)}>
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select className="form-control me-1" style={{ width: "300px" }} onChange={(e) => setFurnish(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Full Furnished">Full Furnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
              <button onClick={handleSearch} className="btn btn-warning bg-gradient text-white" type="submit"><i className="fa fa-search"></i></button>
            </form>
          </div>
        </div>
      </nav>
      </div>
      <Outlet />
      </>
  );
}

