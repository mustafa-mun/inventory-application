const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

// Display list of all books.
exports.item_list = (req, res, next) => {
  async function getItems() {
    try {
      const items = await Item.find({});
      return items;
    } catch (error) {
      return next(error);
    }
  }
  getItems().then((results) => {
    res.render("item_list", {
      title: "All Items",
      item_list: results,
    });
  });
};

exports.item_detail = (req, res, next) => {
  // Find item with url id
  async function findItem() {
    try {
      const item = await Item.findOne({ _id: req.params.id }).populate(
        "category"
      );
      return item;
    } catch (error) {
      return next(error);
    }
  }
  // Render page with item details
  findItem()
    .then((result) => {
      res.render("item_detail", { item: result });
    })
    .catch((err) => next(err));
};

exports.item_create_get = (req, res, next) => {
  async function getCategories() {
    try {
      const categories = await Category.find({});
      return categories;
    } catch (error) {
      return next(error);
    }
  }
  getCategories().then((result) => {
    res.render("item_create", { title: "Create Item", categories: result });
  });
};

exports.item_create_post = [
  // Validate fields
  body("name", "Name should be at least three characters!")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description field can't be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price should be between 0.1 and 999999").isFloat({
    min: 0.1,
    max: 999999,
  }),
  body(
    "number_in_stocks",
    "Number in stock should be between 1 and 1000"
  ).isFloat({ min: 1, max: 1000 }),
  (req, res, next) => {
    // Extracts errors from request
    const errors = validationResult(req);

    async function getCategories() {
      try {
        const categories = await Category.find({});
        return categories;
      } catch (error) {
        return next(error);
      }
    }

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/errors messages
      getCategories().then((result) => {
        res.render("item_create", {
          title: "Create Item",
          categories: result,
          item: req.body,
          errors: errors.array(),
        });
      });
      return; // Return after sending the first response
    }
    // Form data is valid
    // Create item object with new data

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stocks: req.body.number_in_stocks,
    });
    item
      .save()
      .then(() => res.redirect(item.url))
      .catch((err) => next(err));
  },
];

exports.item_delete_get = (req, res, next) => {
  async function findItem() {
    try {
      const item = await Item.findOne({ _id: req.params.id });
      return item;
    } catch (error) {
      return next(error);
    }
  }

  findItem()
    .then((result) => {
      res.render("item_delete", { item: result });
    })
    .catch((err) => next(err));
};

exports.item_delete_post = [
  // Check if admin password is correct
  body("password", "Admin password is not correct!").equals(
    process.env.ADMIN_PASSWORD
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors
      async function findItem() {
        try {
          const item = await Item.findOne({ _id: req.params.id });
          return item;
        } catch (error) {
          return next(error);
        }
      }

      findItem()
        .then((result) => {
          res.render("item_delete", { item: result, errors: errors.array() });
        })
        .catch((err) => next(err));
    } else {
      // Data is valid, delete the item and redirect to items page.
      async function deleteItem() {
        try {
          await Item.findByIdAndDelete(req.params.id);
        } catch (error) {
          return next(error);
        }
      }
      deleteItem().then(() => res.redirect("/home/items"));
    }
  },
];

exports.item_update_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: Item update id ${req.params.id}`);
};

exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update post");
};
