import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";
import { loadCart, removeItemFromCart } from "./helper/CartHelper";
import PaymentB from "./PaymentB";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = products => {
    return (
      <div>
        <h2>This section is to load products</h2>
        {products &&
          products.length &&
          products.map((product, index) => {
            return (
              <div className="mb-2" key={index}>
                <Card
                  // key={index}
                  product={product}
                  addtoCart={false}
                  removefromCart={true}
                  reload={reload}
                  setReload={setReload}
                />
              </div>
            );
          })}
      </div>
    );
  };

  const loadCheckOut = () => {
    return (
      <div>
        <h2>This section is for checkout</h2>
      </div>
    );
  };

  return (
    <Base title="Cart Page" description="check out Tshirt Cart">
      <div className="row text-center">
        <div className="col-6">{loadAllProducts(products)}</div>
        <div className="col-6">
          <PaymentB products={products} reload={reload} setReload={setReload} />
        </div>
      </div>
    </Base>
  );
}
