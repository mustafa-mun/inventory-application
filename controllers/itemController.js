const Item = require("../models/item");
const Category = require("../models/category");
const crudFunction = require("./crudFunctions");
const { body, validationResult } = require("express-validator");

// Display list of all books.
exports.item_list = (req, res, next) => {
  // Find all items
  // After items found, render them
  crudFunction.getAllCollectionDocuments(Item, next).then((results) => {
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
      // Populating the category field so we can use it
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
  // Get all categories for select input and render create form page
  crudFunction.getAllCollectionDocuments(Category, next).then((result) => {
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

    if (!errors.isEmpty()) {
      // There are errors.
      // Get all Category documents
      crudFunction.getAllCollectionDocuments(Category, next).then((result) => {
        // Render the form again with sanitized values/errors messages
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
  // Find item with url id
  crudFunction
    .findDocumentWithID(Item, req.params.id, next)
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
      // Render the delete form again with errors
      crudFunction
        .findDocumentWithID(Item, req.params.id, next)
        .then((result) => {
          res.render("item_delete", { item: result, errors: errors.array() });
        })
        .catch((err) => next(err));
    } else {
      // Data is valid, delete the item and redirect to items page.
      crudFunction
        .deleteDocument(Item, req.params.id, next)
        .then(() => res.redirect("/home/items"));
    }
  },
];

exports.item_update_get = (req, res, next) => {
  // Auth user before update form
  crudFunction.findDocumentWithID(Item, req.params.id, next).then((result) => [
    res.render("password", {
      title: "Enter Admin Password",
      model: "item",
      item: result,
    }),
  ]);
};

exports.item_update_password_handle = [
  // Check if passwor is correct
  body("password", "Admin password is not correct!").equals(
    process.env.ADMIN_PASSWORD
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render password page again with errors
      crudFunction
        .findDocumentWithID(Item, req.params.id, next)
        .then((result) => {
          res.render("password", {
            title: "Enter Admin Password!",
            model: "item",
            item: result,
            errors: errors.array(),
          });
        });
    } else {
      // Password is true, render update form.
      Promise.all([
        // Find category with url id (This step is for filling input fields with current item data)
        crudFunction.findDocumentWithID(Item, req.params.id, next),
        // Get all categories for select input
        crudFunction.getAllCollectionDocuments(Category, next),
      ]).then((results) => {
        res.render("item_create", {
          title: "Update Item",
          model: "item",
          item: results[0],
          categories: results[1],
        });
      });
    }
  },
];

exports.item_update_post = [
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

    if (!errors.isEmpty()) {
      // There are errors.
      // Get all Category documents
      Promise.all([
        // Find category with url id (This step is for filling input fields with current item data)
        crudFunction.findDocumentWithID(Item, req.params.id, next),
        // Get all categories for select input
        crudFunction.getAllCollectionDocuments(Category, next),
      ]).then((results) => {
        res.render("item_create", {
          title: "Update Item",
          model: "item",
          item: results[0],
          categories: results[1],
          errors: errors.array(),
        });
      });
      return; // Return after sending the first response
    }
    // Form data is valid
    // Create item object with updated data

    const updatedItem = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stocks: req.body.number_in_stocks,
      _id: req.params.id,
    });

    crudFunction.updateDocumentWithID(
      Item,
      req.params.id,
      res,
      updatedItem,
      next
    );
  },
];
