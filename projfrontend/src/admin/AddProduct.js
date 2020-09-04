import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { getCategories, createProduct } from "./helper/adminapicall";
import { isAuthenticated } from "../auth";

const AddProduct = () => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    description: "",
    name: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    err: false,
    createdProduct: "",
    getRedirect: false,
    formData: ""
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    err,
    createdProduct,
    getRedirect,
    formData
  } = values;

  const preload = () => {
    getCategories().then(data => {
      if (data.err) {
        setValues({ ...values, err: data.err });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const onSubmit = event => {
    event.preventDefault();
    setValues({ ...values, err: "", loading: true });
    createProduct(user._id, token, formData)
      .then(data => {
        if (data.err) {
          setValues({ ...values, err: data.err, loading: false });
        } else {
          setValues({
            description: "",
            name: "",
            price: "",
            stock: "",
            photo: "",
            categories: [],
            category: "",
            loading: false,
            err: false,
            createdProduct: data.name,
            getRedirect: true,
            formData: ""
          });
        }
      })
      .catch();
  };

  const handleChange = field => event => {
    // console.log(event.target.files);

    const value =
      field === "photo" ? event.target.files[0] : event.target.value;
    formData.set(field, value);
    setValues({
      ...values,
      err: false,
      getRedirect: false,
      loading: false,
      [field]: value
    });
  };

  const successMessage = () => {
    return (
      createdProduct && (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-center">
            <div className="alert alert-success">
              <p>Product Created</p>
            </div>
          </div>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      err && (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-center">
            <div className="alert alert-danger">
              <p>{err.errmsg}</p>
              {console.log(err)}
            </div>
          </div>
        </div>
      )
    );
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-center">
            <div className="alert alert-primary">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      )
    );
  };

  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="name"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="description"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories.length &&
            categories.map((cate, i) => {
              return (
                <option value={cate._id} key={i}>
                  {cate.name}
                </option>
              );
            })}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success"
      >
        Create Product
      </button>
    </form>
  );

  return (
    <Base
      title="Add a product"
      description="Welcome to product creation section"
      className="container bg-info p-4"
    >
      {successMessage()}
      {errorMessage()}
      {loadingMessage()}
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">{createProductForm()}</div>
      </div>
    </Base>
  );
};

export default AddProduct;
