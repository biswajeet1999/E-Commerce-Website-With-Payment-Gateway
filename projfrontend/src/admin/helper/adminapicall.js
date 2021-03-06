import API from "../../backend";

// create a category
export const createCategory = (userId, token, category) => {
  return fetch(`${API}/category/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(category)
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

// get all categories
export const getCategories = () => {
  return fetch(`${API}/categories`, {
    method: "GET"
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

// create a new product
export const createProduct = (userId, token, product) => {
  return fetch(`${API}/product/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      // "Content-Type": ,
      Authorization: `Bearer ${token}`
    },
    body: product
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

// get all products
export const getProducts = () => {
  return fetch(`${API}/products`, {
    method: "GET"
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

// get a product
export const getProduct = productId => {
  return fetch(`${API}/product/${productId}`, {
    method: "GET"
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

// update product
export const updateProduct = (userId, token, productId, product) => {
  return fetch(`${API}/product/${productId}/${userId}`, {
    method: "PUT",
    headers: {
      Application: "application/json",
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: product
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

// delete product
export const deleteProduct = (userId, token, productId) => {
  return fetch(`${API}/product/${productId}/${userId}`, {
    method: "DELETE",
    headers: {
      Application: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};
