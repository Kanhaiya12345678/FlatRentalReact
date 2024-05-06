import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";

function AddApartments() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [furnish, setFurnish] = useState("");
  const [atype, setAtype] = useState("");
  const [ebill, setEbill] = useState("");
  const [extra, setExtra] = useState("");
  const [gender, setGender] = useState("");
  const [rent, setRent] = useState("");
  const [pic1, setPic1] = useState(null);
  const [pic2, setPic2] = useState(null);
  const [pic3, setPic3] = useState(null);
  const [pic4, setPic4] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("furnish", furnish);
    formData.append("atype", atype);
    formData.append("ebill", ebill);
    formData.append("extra", extra);
    formData.append("gender", gender);
    formData.append("rent", rent);
    formData.append("pic1", pic1);
    formData.append("pic2", pic2);
    formData.append("pic3", pic3);
    formData.append("pic4", pic4);
  
    try {
      const result = await axios.post(
        "http://localhost:8081/addApartment",
        formData
      );
      navigate("/apartments");
      swal.fire({
        position: "center",
        icon: "success",
        title: "Add Apartment successfully",
      });
    } catch (err) {
      console.error("Error:", err);
    console.error("Request data:", err.config.data);
    console.error("Response data:", err.response.data);
      swal.fire({
        position: "center",
        icon: "error",
        title: "Apartment failed",
      });
    }
  };

  const handleFileInput = (event, setterFunction) => {
    const file = event.target.files && event.target.files[0];
    setterFunction(file || null);
  };

  return (
    <div className="container mt-5">
      <div className="title">Apartment Registration</div>
      <form>
        <div className="user-details">
          <div className="input-box">
            <span className="details">Apartment Name</span>
            <input
              type="text"
              placeholder="Enter your name"
              id="firstName"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Address</span>
            <input
              type="text"
              placeholder="Enter address"
              id="emailid"
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">City</span>
            <input
              type="text"
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <span className="details">State</span>
            <input
              type="text"
              placeholder="Enter state"
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Monthly Rent</span>
            <input
              type="number"
              min={1}
              placeholder="Enter your rent"
              onChange={(e) => setRent(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Electricity bill</span>
            <input
              type="number"
              min={1}
              placeholder="Enter your rent"
              onChange={(e) => setEbill(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Extra Features</span>
            <input
              type="text"
              placeholder="Enter extra features"
              onChange={(e) => setExtra(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <span className="details">Gender</span>
            <select onChange={(e) => setGender(e.target.value)} required>
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="input-box">
            <span className="details">Select Apartment Type</span>
            <select onChange={(e) => setAtype(e.target.value)} required>
              <option>Select Type</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>2 RK</option>
            </select>
          </div>
          <div className="input-box">
            <span className="details">Select Furnish Type</span>
            <select onChange={(e) => setFurnish(e.target.value)} required>
              <option>Select Type</option>
              <option>Full Furnished</option>
              <option>Semi Furnished</option>
              <option>Unfurnished</option>
            </select>
          </div>
          <div className="input-box">
            <span className="details">Photo 1</span>
            <input
              type="file"
              placeholder="First Photo"
              onChange={(e) => handleFileInput(e, setPic1)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Photo 2</span>
            <input
              type="file"
              placeholder="Second Photo"
              onChange={(e) => handleFileInput(e, setPic2)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Photo 3</span>
            <input
              type="file"
              placeholder="Third Photo"
              onChange={(e) => handleFileInput(e, setPic3)}
              required
            />
          </div>
          <div className="input-box">
            <span className="details">Photo 4</span>
            <input
              type="file"
              placeholder="Fourth Photo"
              onChange={(e) => handleFileInput(e, setPic4)}
              required
            />
          </div>
        </div>

        <div className="button">
          <input type="submit" value="Submit" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
}

export default AddApartments;
