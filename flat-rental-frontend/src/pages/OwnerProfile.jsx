import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
 
function OwnerProfile() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [data, setData] = useState({
    username: '',
    address: '',
    contactNo: '',
    email: '',
    billImage: '',
    adharImage: '',
    gender: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:8081/oprofile')
      .then((res) => {
        console.log('Profile Data:', res.data);
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        } else {
          alert('Error: ' + res.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Error fetching profile data');
      });
  }, []);
    
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };
  return (
    <>
      <div className="container mt-5">            
            <h4>Owner Profile {data.username}</h4>
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>User name</th>
                        <th>{data.username}</th>
                        <th rowspan={7}>
                            <img src={`http://localhost:8081/images/` + data.adharImage} style={{width:"400px"}} alt='Adhar Card' /><br/>
                            Adhar Id     
                        </th>
                        <th rowSpan={5}>
                            Light Bill Image<br/>
                            <img style={{height:"250px",width:"400px"}} src={`http://localhost:8081/images/` + data.billImage} alt="Light Bill" />
                        </th>
                    </tr>
                    <tr>
                        <th>Gender</th>
                        <th>{data.gender}</th>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <th>{data.address}</th>
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
                            className={`input-group-text toggle-password-2 ${showPassword1 ? "fa fa-eye-slash" : "fa fa-eye"}`}
                            onClick={togglePasswordVisibility}
                        ></span>
                        </th>
                        <th>{showPassword ? data.contactNo : "********"}</th>                        
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
                        <th>{showPassword1 ? data.email : "********"}</th>                        
                    </tr>
                    <tr>
                        <th>Owner Status</th>
                        <th>{data?.active ? 'Active':'Inactive'}</th>
                    </tr>
                    {/* <tr className='text-center'>
                        <th colSpan={3}><button className='btn btn-primary'>Update</button></th>
                    </tr> */}
                </thead>
            </table>
            </div>
    </>
  )
}

export default OwnerProfile
