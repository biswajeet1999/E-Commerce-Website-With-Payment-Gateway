const stripe = require("stripe")("sk_test_St0KAG4bgLw1YTg73Mhm0KgH00mFr3T4HY");
const uuid = require("uuid/v4");

exports.makePayment = (req, res) => {
  const { products, token } = req.body;
  console.log(products);
  let amount = 0;
  products.map(prod => {
    amount += prod.price;
  });

  const idempotenceyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id
    })
    .then(customer => {
      stripe.charges.create(
        {
          amount: amount * 100, // converts cent into $
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: "test account",

          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip
            }
          }
        },
        idempotenceyKey
      );
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
};
