import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <div>
      <footer className="z-index Footer stick-bottom text-center text-white mx-auto bottom-0">
        <div className="container-fluid p-1">
          <a className="btn btn-outline-light btn-floating m-2" href="#" type="button">
            <i className="fa fa-facebook-f"></i>
          </a>

          <a className="btn btn-outline-light btn-floating m-2" href="#" type="button">
            <i className="fa fa-twitter"></i>
          </a>

          <a className="btn btn-outline-light btn-floating m-2" href="#" type="button">
            <i className="fa fa-google"></i>
          </a>

          <a className="btn btn-outline-light btn-floating m-2" href="#" type="button">
            <i className="fa fa-instagram"></i>
          </a>

          <a className="btn btn-outline-light btn-floating m-2" href="#" type="button">
            <i className="fa fa-linkedin"></i>
          </a>

          <a className="btn btn-outline-light btn-floating m-2" href="#" type="button">
            <i className="fa fa-github"></i>
          </a>
        </div>

        <div>
          <h2>Flat Rental</h2>
          <p>Here are the homes where comfort begins. Explore the website for a much more amazing experience!</p>
          <p>Contact No: +91 12345***** &emsp; &emsp; &emsp; Email: flatrental@example.com</p>
        </div>

        <div className="text-center p-1">
          © Copyright by Flat Rental
        </div>
        <br />
      </footer>
    </div>
  );
}

export default Footer;
