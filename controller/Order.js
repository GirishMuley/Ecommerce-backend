const { Order } = require("../model/Order");
const { Product } = require("../model/Product");
const { User } = require("../model/User");
const { sendMail, invoiceTemplate } = require("../services/common");

const formatOrder = (order) => {
  const orderObject = order.toObject ? order.toObject() : order;

  const { _id, ...rest } = orderObject;

  return {
    id: _id,
    ...rest,
  };
};

// Fetch orders for logged-in user
exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;

  try {
    const orders = await Order.find({ user: id });

    const formattedOrders = orders.map(formatOrder);

    res.status(200).json(formattedOrders);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);

    // Update product stock
    for (let item of order.items) {
      const product = await Product.findOne({
        _id: item.product.id,
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      product.stock -= item.quantity;

      await product.save();
    }

    const doc = await order.save();

    const user = await User.findById(order.user);

    // Send invoice email
    sendMail({
      to: user.email,
      html: invoiceTemplate(order),
      subject: "Order Received",
    });

    res.status(201).json(formatOrder(doc));
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(formatOrder(order));
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(formatOrder(order));
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// Fetch all orders
exports.fetchAllOrders = async (req, res) => {
  try {
    const condition = {
      deleted: { $ne: true },
    };

    let query = Order.find(condition);

    if (req.query._sort && req.query._order) {
      query = query.sort({
        [req.query._sort]: req.query._order,
      });
    }

    const page = Math.max(parseInt(req.query._page, 10) || 1, 1);

    const limit = Math.min(parseInt(req.query._limit, 10) || 10, 100);

    if (req.query._page && req.query._limit) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const [totalDocs, docs] = await Promise.all([
      Order.countDocuments(condition),
      query.exec(),
    ]);

    const formattedOrders = docs.map(formatOrder);

    res.set("X-Total-Count", totalDocs);

    res.status(200).json(formattedOrders);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
