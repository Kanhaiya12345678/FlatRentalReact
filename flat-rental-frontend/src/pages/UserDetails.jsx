import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"

export default function UserDetails(){
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [user, setUser] = useState({});
    const { id } = useParams();
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/userDetails/${id}`);
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
  
      fetchUserDetails();
    }, [id]);

    const toggleUserStatus = async () => {
        try {
            const response = await axios.put(`http://localhost:8081/toggleUserStatus/${id}`);
            setUser(response.data);
        } catch (error) {
            console.error("Error toggling user status:", error);
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
    };
    const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
    };
    return(        
        <>
            <div className="container mt-5">
            <button onClick={toggleUserStatus} className={`btn ${user?.active ? 'btn-danger' : 'btn-primary'} float-end`}>
                {user?.active ? 'Deactivate' : 'Activate'}
            </button>
            <h4>Details of User {user.username}</h4>
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>User name</th>
                        <th>{user.username}</th>
                        <th rowspan={7}>
                            <img src={`http://localhost:8081/images/`+user.adharImage} style={{width:"500px"}} alt='Adhar Card' /><br/>
                            Adhar Id     
                        </th>
                    </tr>
                    <tr>
                        <th>Gender</th>
                        <th>{user.gender}</th>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <th>{user.address}</th>
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
                        <th>{showPassword ? user.contactNo : "********"}</th>                        
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
                        <th>{showPassword1 ? user.email : "********"}</th>                        
                    </tr>
                    <tr>
                        <th style={{ position: 'relative' }}>
                            Aadhar No
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
                            className={`input-group-text toggle-password-2 ${showPassword2 ? "fa fa-eye-slash" : "fa fa-eye"}`}
                            onClick={togglePasswordVisibility2}
                        ></span> 
                        </th>
                        <th>{showPassword2 ? user.aadharNo : "********"}</th>                        
                    </tr>
                    <tr>
                        <th>Owner Status</th>
                        <th>{user?.active ? 'Active':'Inactive'}</th>
                    </tr>
                </thead>
            </table>
            </div>
        </>
    )
}
