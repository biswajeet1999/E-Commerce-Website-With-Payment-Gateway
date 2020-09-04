const User = require("../models/user");
const { Order } = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(400).json({
          err: "no user found"
        });
      }
      req.profile = user;
      next();
    })
    .catch(err => {
      return res.status(400).json({
        err: "no user found"
      });
    });
};

exports.getUser = (req, res) => {
  req.profile.salt = req.profile.hassed_password = undefined;
  req.profile.createdAt = req.profile.updatedAt = undefined;
  return res.status(200).json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({ err: "Unable to update user" });
      }
      user.salt = user.hassed_password = undefined;
      user.createdAt = user.updatedAt = undefined;
      return res.status(200).json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.findById({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({ err: "No order found" });
      }
      return res.status(200).json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({ err: "Unable to save order" });
      }
      next();
    }
  );
};
