import React, { useState, Fragment } from "react";
import Base from "../core/Base";
import { Link, withRouter, Redirect } from "react-router-dom";
import { signin, isAuthenticated, authenticate } from "../auth";

const Signin = ({ history }) => {
  const [values, setValues] = useState({
    email: "biswajeetpadhi1999@gmail.com",
    password: "12345",
    err: false,
    loading: false,
    didRedirect: false
  });

  const { email, password, err, loading, didRedirect } = values;
  const user = isAuthenticated();

  const handleChange = field => {
    return event => {
      setValues({ ...values, [field]: event.target.value });
    };
  };

  const onSubmit = event => {
    event.preventDefault();
    setValues({ ...values, err: false, loading: true });
    signin({ email, password })
      .then(data => {
        if (data.err) {
          setValues({
            ...values,
            err: JSON.stringify(data.err),
            loading: false
          });
        } else {
          authenticate(data, () =>
            setValues({
              ...values,
              err: false,
              loading: false,
              didRedirect: true
            })
          );
        }
      })
      .catch(err => {
        console.log(err);
        setValues({
          ...values,
          loading: false,
          didRedirect: false,
          err: "Unable to Signin"
        });
      });
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.user.role == 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
  };

  const performLoading = () => {
    if (loading === true) {
      return (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-center">
            <div className="alert alert-primary">
              <p>loading... please wait</p>
            </div>
          </div>
        </div>
      );
    }
  };

  const message = () => {
    return (
      err && (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-center">
            <div className="alert alert-danger">{err}</div>
          </div>
        </div>
      )
    );
  };

  const SignInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-left">
          <form action="">
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                value={email}
                onChange={handleChange("email")}
                className="form-control"
                type="email"
              />
            </div>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                value={password}
                className="form-control"
                type="password"
                onChange={handleChange("password")}
              />
            </div>
            <button className="btn btn-success btn-block" onClick={onSubmit}>
              Sign Ip
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="Sign in page" description="A page for user to sign in">
      {performLoading()}
      {message()}
      {SignInForm()}
      {performRedirect()}
    </Base>
  );
};

export default withRouter(Signin);
