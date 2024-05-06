import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [email, setEmail] = useState();
  const [question, setquestion] = useState();
  const [pwd, setpwd] = useState();
  const [confirmPwd, setConfirmPwd] = useState(); // New state for confirm password
  const [answer, setanswer] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (pwd !== confirmPwd) {
      Swal.fire({ title: "New password and confirm password do not match." });
      return;
    }

    const data = {
      answer: answer,
      email: email,
      question: question,
      pwd: pwd,
      confirmPwd: confirmPwd, // Include confirm password in the request body
    };

    axios.post("http://localhost:8081/reset", data)
      .then((resp) => {
        Swal.fire({ title: resp.data.message });
        navigate("/login");
      })
      .catch((error) => {
        Swal.fire({ title: error.response.data.error });
      });
  };

  return (
    <>
      <div className="container mt-5">
        <h5>Forgot Password</h5>
        <div className="row">
          <div className="col-sm-12 mx-auto">
            <form>
              <div>
                <div className="mb-3 row">
                  <label className="col-sm-5 col-form-label">User Id</label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-5 col-form-label">Security Question</label>
                  <div className="col-sm-7">
                    <select
                      className="form-control"
                      value={question}
                      onChange={(e) => setquestion(e.target.value)}
                      required
                    >
                      <option>Select Security Question</option>
                      <option>What is your nick name ?</option>
                      <option>Which is your favorite pet name ?</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-5 col-form-label">Answer</label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      onChange={(e) => setanswer(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-5 col-form-label">New Password</label>
                  <div className="col-sm-7">
                    <input
                      type="password"
                      onChange={(e) => setpwd(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-5 col-form-label">Repeat Password</label>
                  <div className="col-sm-7">
                    <input
                      type="password"
                      onChange={(e) => setConfirmPwd(e.target.value)} // Update state on confirm password change
                      className="form-control"
                    />
                  </div>
                </div>
                <button onClick={handleSubmit} className="btn btn-primary float-end">
                  Reset Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
