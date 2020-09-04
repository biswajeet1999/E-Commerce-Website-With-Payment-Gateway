import React, { useState } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, token } = isAuthenticated();

  const goBack = () => {
    return (
      <div className="mt-5">
        <Link
          className="btn btn-sm btn-success rounded mb-3"
          to="/admin/dashboard"
        >
          Home
        </Link>
      </div>
    );
  };

  const handleChange = event => {
    setError(false);
    setName(event.target.value);
    setLoading(false);
    setSuccess(false);
  };

  const onSubmit = event => {
    event.preventDefault();
    setError(false);
    setSuccess(false);
    setLoading(true);
    createCategory(user._id, token, { name }).then(data => {
      setLoading(false);
      if (data.err) {
        setError(data.err);
      } else {
        setError(false);
        setSuccess(true);
        setName("");
      }
    });
  };

  const handleLoading = () => {
    return (
      loading && (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-center">
            <div className="alert alert-primary">
              <p>loading... please wait</p>
            </div>
          </div>
        </div>
      )
    );
  };

  const successMessage = () => {
    return (
      success && (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-center">
            <div className="alert alert-success">
              <p>Category Created</p>
            </div>
          </div>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      error && (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-center">
            <div className="alert alert-danger">
              <p>{error.errmsg}</p>
            </div>
          </div>
        </div>
      )
    );
  };

  const myCategoryForm = () => {
    return (
      <form action="">
        <div className="form-group">
          <p className="lead">Enter the category</p>
          <input
            type="text"
            className="form-control my-3"
            autoFocus
            required
            placeholder="example: Summer"
            onChange={handleChange}
          />
          <button className="btn btn-outline-info rounded" onClick={onSubmit}>
            Create Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <Base
        title="Create a category"
        description="Add a new category for new Tshirt"
        className="container bg-info p-4"
      >
        <div className="row bg-white rounded">
          <div className="col-md-8 offset-md-2">
            {goBack()}
            {handleLoading()}
            {successMessage()}
            {errorMessage()}
            {myCategoryForm()}
          </div>
        </div>
      </Base>
    </div>
  );
};

export default AddCategory;
