import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    err: "",
    success: false
  });

  let { name, email, password, err, success } = values;

  const handleChange = field => {
    return event => {
      setValues({ ...values, [field]: event.target.value });
    };
  };

  const onSubmit = event => {
    event.preventDefault();
    signup({ name, email, password })
      .then(data => {
        if (data.err) {
          setValues({ ...values, err: data.err, success: false });
        } else {
          setValues({
            ...values,
            name: "",
            password: "",
            email: "",
            err: "",
            success: true
          });
        }
      })
      .catch(() => console.log("Error in signin"));
  };

  const signUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-left">
          <form action="">
            <div className="form-group">
              <label className="text-light">Name</label>
              <input
                className="form-control"
                type="text"
                onChange={handleChange("name")}
                value={name}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                className="form-control"
                type="email"
                onChange={handleChange("email")}
                value={email}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                className="form-control"
                type="password"
                onChange={handleChange("password")}
                value={password}
              />
            </div>
            <button className="btn btn-success btn-block" onClick={onSubmit}>
              {/* Dont use onSubmit event handler, bcz it is not submit button */}
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  };

  const message = () => {
    const msg = success ? (
      <div>
        Account created <Link to="/signin">Login Here</Link>
      </div>
    ) : (
      err
    );
    const display = err === "" && success === false ? "none" : "";
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-center">
          <div
            className={`alert ${success ? "alert-success" : "alert-danger"}`}
            style={{ display }}
          >
            {msg}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Base title="Sign up page" description="A page for user to sign up">
      {message()}
      {signUpForm()}
      <p className="text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default Signup;
