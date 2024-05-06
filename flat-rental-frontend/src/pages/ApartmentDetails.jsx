import axios from "axios"
import { Carousel } from "react-bootstrap"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import PaymentForm from "../components/PaymentForm"

export default function ApartmentDetails(){
    const [apartment, setApartment] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchApartmentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/apartmentDetails/${id}`);
        setApartment(response.data);
      } catch (error) {
        console.error("Error fetching apartment details:", error);
      }
    };

    fetchApartmentDetails();
  }, [id]);

    return(
        <>
        <div className="container mt-5">
            <div className="row">
                <div className="col-sm-5 offset-1">
            <h5>Apartment Details</h5>                    
                    <div className="card" style={{width: '28rem'}}>
                        <Carousel>
                    <Carousel.Item>
                    <img
                        src={`http://localhost:8081/images/` + apartment.pic1}
                        className="d-block w-100"
                         height={300}
                        alt="First slide"
                    />                    
                    </Carousel.Item>
                    <Carousel.Item>
                    <img
                        src={`http://localhost:8081/images/` + apartment.pic2}
                        className="d-block w-100"
                         height={300}
                        alt="Second slide"
                    />
                    </Carousel.Item>

                    <Carousel.Item>
                    <img
                        src={`http://localhost:8081/images/` + apartment.pic3}
                        className="d-block w-100"
                         height={300}
                        alt="Third slide"
                    />
                    </Carousel.Item>
                    <Carousel.Item>
                    <img
                        src={`http://localhost:8081/images/` + apartment.pic4}
                        className="d-block w-100"
                         height={300}
                        alt="Fourth slide"
                    />
                    </Carousel.Item>
                </Carousel>
                <div className="card-body">
                <h5 className="card-title">{apartment.name}</h5>
                <h6>{`${apartment.address}, ${apartment.city} ${apartment.state}`}</h6>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">₹ {apartment.rent}/month</li>
                <li className="list-group-item">For {apartment.gender} only</li>
                <li className="list-group-item">{apartment.atype}</li>
                <li className="list-group-item">{apartment.furnish}</li>
                <li className="list-group-item">Space available for {3-apartment?.bookings}</li>
              </ul>
              <div className="card-body">
                {apartment.ownerId ? (
                  <span>Owner : {apartment.ownerId.username}</span>
                ) : (
                  <span>Owner details not available</span>
                )}
              </div>
                    </div>

                </div>
                <div className="col-sm-5">
                  <PaymentForm id={apartment} />         
                </div>
            </div>
        </div>
        </>
    )
}
