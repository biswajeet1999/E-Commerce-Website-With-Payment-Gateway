const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({ err: "No order found" });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile._id;

  new Order(req.body.order).save((err, order) => {
    if (err) {
      return res.status(400).json({ err: "Unable to save order" });
    }
    return res.status(200).json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({ err: "No orders found" });
      }
      return res.ststua(200).json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.order._id },
    { $set: { status: req.body.status } },
    { new: true },
    (err, order) => {
      if (err) {
        return res.status(400).json({ err: "Unable to update order status" });
      }
      return res.ststua(200).json(order);
    }
  );
};
