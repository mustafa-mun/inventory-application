const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Home page
exports.index = (req, res, next) => {
  // Count documents
  async function countDocs(model) {
    try {
      const count = await model.countDocuments({});
      // Return count and model name as a object for render
      return {
        count,
        name: model.modelName,
      };
    } catch (error) {
      return next(error);
    }
  }
  // Wait for all countings and render them
  Promise.all([countDocs(Item), countDocs(Category)])
    .then((results) => {
      res.render("index", { title: "Strength Dynamics", documents: results });
    })
    .then((results) => console.log(results))
    .catch((err) => next(err));
};
// Display list of all books.
exports.category_list = (req, res, next) => {
  // Find all categories
  async function getCategories() {
    try {
      const categories = await Category.find({});
      return categories;
    } catch (error) {
      return next(error);
    }
  }
  // After categories found, render them
  getCategories().then((result) => {
    res.render("category_list", {
      title: "All Categories",
      collection: result,
    });
  });
};

exports.category_detail = (req, res, next) => {
  // Find category with url id
  async function findCategory() {
    try {
      const category = await Category.findOne({ _id: req.params.id });
      return category;
    } catch (error) {
      return next(error);
    }
  }
  // Find all items with related category
  async function findCategoryItems() {
    try {
      const items = await Item.find({ category: req.params.id });
      return items;
    } catch (error) {
      return next(error);
    }
  }
  // Render Detail page with category name and all it's items
  async
    .parallel({
      category: findCategory,
      items: findCategoryItems,
    })
    .then((results) => {
      res.render("category_detail", {
        category: results.category,
        item_list: results.items,
      });
    })
    .catch((err) => next(err));
};

exports.category_create_get = (req, res) => {
  res.render("category_create", { title: "Create Category" });
};

exports.category_create_post = [
  // Validate fields
  body("name", "Name field can't be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    // Extracts errors from request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/errors messages
      res.render("category_create", {
        title: "Create Category",
        category: req.body,
        errors: errors.array(),
      });
      return; // Return after sending the first response
    }
    // Form data is valid
    // Create category object with new data

    const category = new Category({
      name: req.body.name,
    });
    category
      .save()
      .then(() => res.redirect(category.url))
      .catch((err) => next(err));
  },
];


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
