const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");

// Home page
exports.index = (req, res, next) => {
  async function countDocs(model) {
    try {
      const count = await model.countDocuments({});
      return {
        count,
        name: model.modelName,
      };
    } catch (error) {
      return next(error);
    }
  }
  Promise.all([countDocs(Item), countDocs(Category)])
    .then((results) => {
      res.render("index", { title: "Strength Dynamics", documents: results });
    })
    .then((results) => console.log(results))
    .catch((err) => next(err));
};
// Display list of all books.
exports.category_list = (req, res, next) => {
  async function getCategories() {
    try {
      const categories = await Category.find({});
      return categories
    } catch (error) {
      return next(error);
    }
  }
  res.render("category_list", { title: "All Categories" })
};

exports.category_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Category detail id ${req.params.id}`);
};

exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create get");
};

exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create post");
};

exports.category_delete_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: Category delete id ${req.params.id}`);
};

exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete post");
};

exports.category_update_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: Category update id ${req.params.id}`);
};

exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update post");
};
