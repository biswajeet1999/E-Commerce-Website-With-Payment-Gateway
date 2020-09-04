import React, { useState } from "react";
import ImageHelper from "./helper/ImageHelper";
import { Redirect } from "react-router-dom";
import { addItem, removeItemFromCart } from "./helper/CartHelper";

const Card = ({
  product,
  addtoCart = true,
  removefromCart = false,
  reload = undefined, // these two are require to force reload cart page otherwise no use of reload and setReload
  setReload = f => f // function(f){ return f; }
}) => {
  const title = product ? product.name : "A photo from pixel";
  const description = product ? product.description : "No description found";
  const price = product ? product.price : "0";

  const [redirect, setRedirect] = useState(false);
  //   const [count, setCount] = useState(product.count);

  const addToCart = () => {
    addItem(product, () => setRedirect(true));
  };

  const getRedirect = redirect => {
    return redirect && <Redirect to="/cart" />;
  };

  return (
    <div className="card text-white bg-dark border border-info text-center">
      <div className="card-header lead">{title}</div>
      <div className="card-body">
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {description}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">$ {price}</p>
        {getRedirect(redirect)}
        <div className="row">
          {addtoCart && (
            <div className="col-12">
              <button
                onClick={() => {
                  addToCart();
                }}
                className="btn btn-block btn-outline-success mt-2 mb-2"
              >
                Add to Cart
              </button>
            </div>
          )}
          {removefromCart && (
            <div className="col-12">
              <button
                onClick={() => {
                  removeItemFromCart(product._id);
                  setReload(!reload);
                }}
                className="btn btn-block btn-outline-danger mt-2 mb-2"
              >
                Remove from cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
