import React, { useState, useEffect } from "react";
import { loadCart, cartEmpty } from "./helper/CartHelper";
import { Link } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/paymentBhelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth";
import DropIn from "braintree-web-drop-in-react";

const PaymentB = ({ products, reload = undefined, setReload = f => f }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {}
  });
  const { user, token } = isAuthenticated();

  const getToken = (userId, token) => {
    getmeToken(userId, token).then(inf => {
      // console.log("INFO", inf);

      if (inf.err) {
        setInfo({ ...info, error: inf.err });
      } else {
        const clientToken = inf.clientToken;
        setInfo({ ...info, clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(user._id, token);
  }, []);

  const showbtdropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={instance => setInfo({ ...info, instance: instance })}
            />
            <button className="btn btn-block btn-success" onClick={onPurchase}>
              Buy
            </button>
          </div>
        ) : (
          <h3>please login or cart is empty</h3>
        )}
      </div>
    );
  };

  const onPurchase = () => {
    setInfo({ ...info, loading: true });
    let nonce;
    console.log(info.instance);

    let getNonce = info.instance.requestPaymentMethod().then(data => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount()
      };

      processPayment(user._id, token, paymentData)
        .then(res => {
          setInfo({ ...info, success: res.success, loading: false });
          console.log("Success");

          const orderData = {
            products: products,
            transaction_id: res.transaction.id,
            amount: res.transaction.amount
          };
          createOrder(user._id, token, orderData);
          cartEmpty(() => {
            // console.log("did we got crashed");
            setReload(!reload);
          });
        })
        .catch(err => {
          console.log("Failed");
          setInfo({ ...info, error: err, success: false, loading: false });
        });
    });
  };

  const getAmount = () => {
    let amount = 0;
    if (products) {
      products.map(p => {
        amount += p.price;
      });
    }
    return amount;
  };

  return (
    <div>
      <h3>Price: {getAmount()}</h3>
      {showbtdropIn()}
    </div>
  );
};

export default PaymentB;
