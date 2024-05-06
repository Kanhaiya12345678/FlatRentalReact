import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"

export default function OwnerDetails(){
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [owner, setOwner] = useState({});
    const { id } = useParams();
  
    useEffect(() => {
      const fetchOwnerDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/ownerDetails/${id}`);
          setOwner(response.data);
        } catch (error) {
          console.error("Error fetching Owner details:", error);
        }
      };
   
      fetchOwnerDetails();
    }, [id]);

    const toggleOwnerStatus = async () => {
        try {
            const response = await axios.put(`http://localhost:8081/toggleOwnerStatus/${id}`);
            setOwner(response.data);
        } catch (error) {
            console.error("Error toggling Owner status:", error);
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
    };
    return(        
        <>
            <div className="container mt-5">
            <button onClick={toggleOwnerStatus} className={`btn ${owner?.active ? 'btn-danger' : 'btn-primary'} float-end`}>
                {owner?.active ? 'Deactivate' : 'Activate'}
            </button>
            <h4>Owner Details of Owner {owner.username}</h4>
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>User name</th>
                        <th>{owner.username}</th>
                        <th rowspan={7}>
                            <img src={`http://localhost:8081/images/`+owner.adharImage} style={{width:"400px"}} alt='Adhar Card' /><br/>
                            Adhar Id     
                        </th>
                        <th rowSpan={7}>
                            <img style={{height:"250px",width:"400px"}} src={`http://localhost:8081/images/`+owner.billImage} alt="Light Bill" /><br/>
                            Light Bill Image
                        </th>
                    </tr>
                    <tr>
                        <th>Gender</th>
                        <th>{owner.gender}</th>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <th>{owner.address}</th>
                    </tr>
                    <tr>
                        <th style={{ position: 'relative' }}>
                            Phone no
                        <span
                            style={{
                            position: 'absolute',
                            top: '69%',
                            right: '0px',
                            height: '30px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer', backgroundColor:"green",
                            padding:"8px", color:"red"
                            }}
                            className={`input-group-text toggle-password-2 ${showPassword ? "fa fa-eye-slash" : "fa fa-eye"}`}
                            onClick={togglePasswordVisibility}
                        ></span>
                        </th>
                        <th>{showPassword ? owner.contactNo : "********"}</th>                        
                    </tr>
                    <tr>
                        <th style={{ position: 'relative' }}>
                            Email Id
                        <span
                            style={{
                            position: 'absolute',
                            top: '69%',
                            right: '0px',
                            height: '30px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer', backgroundColor:"green",
                            padding:"8px", color:"red"
                            }}
                            className={`input-group-text toggle-password-2 ${showPassword1 ? "fa fa-eye-slash" : "fa fa-eye"}`}
                            onClick={togglePasswordVisibility1}
                        ></span> 
                        </th>
                        <th>{showPassword1 ? owner.email : "********"}</th>                        
                    </tr>
                    <tr>
                        <th>Owner Status</th>
                        <th>{owner?.active ? 'Active':'Inactive'}</th>
                    </tr>
                </thead>
            </table>
            </div>
        </>
    )
}
