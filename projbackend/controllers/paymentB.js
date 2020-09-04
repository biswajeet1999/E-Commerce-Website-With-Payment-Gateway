var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "x6765kps8ytdy66p",
  publicKey: "7by23tt3y5ysy32d",
  privateKey: "b0394880cef034be839bf538e2b25cb9"
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function(err, response) {
    if (err) {
      // sending data as json gives some bug so we use send method
      res.status(500).send(err);
    } else {
      //   var clientToken = response.clientToken;
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true
      }
    },
    function(err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.send(result);
      }
    }
  );
};
