const { IncomingForm } = require("formidable");
const { validationResult } = require("express-validator");
const _ = require("lodash");
const fs = require("fs");

const Product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({ err: "Unable to find product" });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  let form = new IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ err: "Unable to create product" });
    }

    let product = new Product(fields);
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ err: "file size too big" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({ err: "Unable to create product" });
      }
      return res.status(200).json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.status(200).json(req.product);
};

// middleware for sending photo in optimized way
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-type", req.product.photo.contentType);
    res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  Product.findByIdAndDelete(req.product._id, (err, product) => {
    if (err) {
      return res.status(400).json({ err: "Unable to delete product" });
    }
    res.status(200).json({ message: "Successfully deleted" });
  });
};

exports.updateProduct = (req, res) => {
  let form = new IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ err: "Unable to update product" });
    }

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ err: "file size too big" });
      }
      fields.photo = {
        data: fs.readFileSync(file.photo.path),
        contentType: file.photo.type
      };
    }

    Product.findByIdAndUpdate(
      { _id: req.product._id },
      { $set: fields },
      { new: true },
      (err, product) => {
        if (err) {
          return res.status(400).json({ err: "Unable to update product" });
        }
        return res.status(200).json(product);
      }
    );
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find({})
    .select("-photo") // will not include photo
    .limit(limit)
    .populate("category")
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
      if (err || !products.length) {
        return res.status(400).json({ err: "No products found" });
      }
      return res.status(200).json(products);
    });
};

exports.updateStock = (req, res, next) => {
  let operations = req.body.order.products.map(product => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } }
      }
    };
  });

  Product.bulkWrite(operations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({ err: "Bulk operation failed" });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {})
    .populate("category")
    .exec((err, categories) => {
      if (err) {
        return res.status(400).json({ err: "NO category found" });
      }
      return res.status(200).json(categories);
    });
};
