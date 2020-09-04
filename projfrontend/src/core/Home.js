import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState(false);

  const loadAllProducts = () => {
    getProducts()
      .then(data => {
        if (data.err) {
          setErr(data.err);
        } else {
          setProducts(data);
        }
      })
      .catch(err => console.log("Unable to fetch products"));
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  return (
    <Base title="Home Page" description="Welcome to Tshirt Store">
      <div className="row text-center">
        <h2 className="text-white">All of tshirts</h2>
        <div className="row">
          {products.map((product, index) => {
            return (
              <div key={index} className="col-4 mb-4">
                <Card product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
}
