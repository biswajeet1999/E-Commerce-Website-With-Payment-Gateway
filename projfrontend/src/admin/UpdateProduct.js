import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import {
  getCategories,
  updateProduct,
  getProduct
} from "./helper/adminapicall";
import { isAuthenticated } from "../auth";

const UpdateProduct = ({ match }) => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    description: "",
    name: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    categoryName: "",
    loading: false,
    err: false,
    formData: new FormData(),
    success: false
  });

  const {
    name,
    description,
    price,
    stock,
    photo,
    categories,
    category,
    categoryName,
    loading,
    err,
    formData,
    success
  } = values;

  const preload = () => {
    let categoryList = [];
    getCategories().then(data => {
      if (data.err) {
        setValues({ ...values, err: data.err, success: false });
      } else {
        categoryList = data;
      }
    });

    getProduct(match.params.productId)
      .then(prod => {
        if (prod.err) {
          setValues({
            ...values,
            err: "Unable to fetch product",
            success: false
          });
        } else {
          setValues({
            ...values,
            name: prod.name,
            description: prod.description,
            price: prod.price,
            stock: prod.stock,
            category: prod.category._id,
            categoryName: prod.category.name,
            categories: categoryList,
            success: false
          });
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    preload();
  }, []);

  const onSubmit = event => {
    event.preventDefault();
    setValues({ ...values, err: "", loading: true });
    updateProduct(user._id, token, match.params.productId, formData)
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
            categoryName: "",
            loading: false,
            err: false,
            getRedirect: true,
            formData: "",
            success: true
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
      success && (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-center">
            <div className="alert alert-success">
              <p>Product Updated</p>
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
          <option value={category}>{categoryName}</option>
          {categories.length &&
            categories.map((cate, index) => {
              return (
                <option value={cate._id} key={index}>
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
        Update Product
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

export default UpdateProduct;
