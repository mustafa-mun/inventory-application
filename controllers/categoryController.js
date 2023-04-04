const Category = require("../models/category");
const Item = require("../models/item");
const crudFunction = require("./crudFunctions");
const { body, validationResult } = require("express-validator");

// Home page
exports.index = (req, res, next) => {
  // Count documents
  // Wait for all countings and render them
  Promise.all([
    crudFunction.countDocs(Item, next),
    crudFunction.countDocs(Category, next),
  ])
    .then((results) => {
      res.render("index", { title: "Strength Dynamics", documents: results });
    })
    .catch((err) => next(err));
};
// Display list of all categories.
exports.category_list = (req, res, next) => {
  // Find all categories
  // After categories found, render them
  crudFunction.getAllCollectionDocuments(Category, next).then((result) => {
    res.render("category_list", {
      title: "All Categories",
      collection: result,
    });
  });
};

exports.category_detail = (req, res, next) => {
  // Find category with url id
  // Find all items with related category
  // Render Detail page with category name and all it's items
  Promise.all([
    crudFunction.findDocumentWithID(Category, req.params.id, next),
    crudFunction.getRelatedDocuments(Item, "category", req.params.id, next),
  ])
    .then((results) => {
      res.render("category_detail", {
        title: "Category detail: " + results[0].name,
        category: results[0],
        item_list: results[1],
      });
    })
    .catch((err) => next(err));
};

exports.category_create_item_get = (req, res, next) => {
  // Render create item with current category (Category add item section)
  Promise.all([
    // Find items current category
    crudFunction.findDocumentWithID(Category, req.params.id, next),
    // Get all categories for select input
    crudFunction.getAllCollectionDocuments(Category, next),
  ]).then((results) => {
    res.render("item_create", {
      title: "Add Category Item",
      model: "item",
      currentCategoryID: results[0]._id,
      categories: results[1],
    });
  });
};

exports.category_create_get = (req, res) => {
  // Render create category
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
        category: req.body.category,
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

exports.category_delete_get = (req, res, next) => {
  // Find all items with related category
  // Render delete page with category name and all it's items
  Promise.all([
    crudFunction.findDocumentWithID(Category, req.params.id, next),
    crudFunction.getRelatedDocuments(Item, "category", req.params.id, next),
  ])
    .then((results) => {
      res.render("category_delete", {
        title: "Delete " + results[0].name,
        category: results[0],
        category_items: results[1],
      });
    })
    .catch((err) => next(err));
};

exports.category_delete_post = [
  // Check if admin password is correct
  body("password", "Admin password is not correct!").equals(
    process.env.ADMIN_PASSWORD
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors
      // Render delete page with errors
      Promise.all([
        crudFunction.findDocumentWithID(Category, req.params.id, next),
        crudFunction.getRelatedDocuments(Item, Category, req.params.id, next),
      ])
        .then((results) => {
          res.render("category_delete", {
            title: "Delete " + results[0].name,
            category: results[0],
            category_items: results[1],
            errors: errors.array(),
          });
        })
        .catch((err) => next(err));
    } else {
      // Password is correct, delete the category and redirect to categories page
      crudFunction
        .deleteDocument(Category, req.params.id, next)
        .then(() => res.redirect("/home/categories"))
        .catch((err) => next(err));
    }
  },
];

exports.category_update_get = (req, res, next) => {
  // Render password form
  crudFunction
    .findDocumentWithID(Category, req.params.id, next)
    .then((result) => [
      res.render("password", {
        title: "Enter Admin Password",
        model: "category",
        item: result,
      }),
    ]);
};

exports.category_update_password_handle = [
  // Check if password is correct
  body("password", "Admin password is not correct!").equals(
    process.env.ADMIN_PASSWORD
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render password page again with errors
      crudFunction
        .findDocumentWithID(Category, req.params.id, next)
        .then((result) => {
          res.render("password", {
            title: "Enter Admin Password!",
            model: "category",
            item: result,
            errors: errors.array(),
          });
        });
    } else {
      // Password is true, render update form.
      crudFunction
        .findDocumentWithID(Category, req.params.id, next)
        .then((result) => {
          res.render("category_create", {
            title: "Update Item",
            category: result,
          });
        });
    }
  },
];

exports.category_update_post = [
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
      crudFunction
        .findDocumentWithID(Category, req.params.id, next)
        .then((result) => {
          res.render("category_create", {
            title: "Update Item",
            category: result,
            errors: errors.array(),
          });
        });
      return; // Return after sending the first response
    }
    // Form data is valid
    // Create category object with new data

    const updatedCategory = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    // Update document with updated document
    crudFunction.updateDocumentWithID(
      Category,
      req.params.id,
      res,
      updatedCategory,
      next
    );
  },
];
