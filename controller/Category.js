const { Category } = require("../model/Category");

exports.fetchCategories = async (req, res) => {
  try {
    const categorys = await Category.find({}).exec();
    res.status(200).json(categorys);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const doc = await category.save();
    res.status(201).json();
  } catch (error) {
    res.status(400).json(error);
  }
};
