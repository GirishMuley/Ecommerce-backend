const { json } = require("express");
const { Product } = require("../model/Product");
const { Order } = require("../model/Order");

exports.createProduct = async (req, res) => {
  //this product we have to get from API body
  const product = new Product(req.body);
  product.discountPrice = Math.round(
    product.price * (1 - product.discountPercentage / 100),
  );
  try {
    const response = await product.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  try {
    // Build filter ONCE
    const condition = {};
    if (!req.query.admin) {
      condition.deleted = { $ne: true };
    }
    if (req.query.category) {
      condition.category = { $in: req.query.category.split(",") };
    }
    if (req.query.brand) {
      condition.brand = { $in: req.query.brand.split(",") };
    }

    let query = Product.find(condition).lean();

    if (req.query._sort && req.query._order) {
      query = query.sort({
        [req.query._sort]: req.query._order === "desc" ? -1 : 1,
      });
    }

    // Parse + sanitize pagination params
    const page = Math.max(parseInt(req.query._page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query._limit, 10) || 10, 100); // cap max limit

    if (req.query._page && req.query._limit) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    // Run count and find in PARALLEL, not sequentially
    const [totalDocs, docs] = await Promise.all([
      Product.countDocuments(condition),
      query.exec(),
    ]);

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100),
    );
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};
