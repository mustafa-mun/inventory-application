const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

// Home page route
router.get("/", categoryController.index);

/// CATEGORY ///

router.get("/category/create", categoryController.category_create_get);

router.post("/category/create", categoryController.category_create_post);

router.get("/category/:id/delete", categoryController.category_delete_get);

router.post("/category/:id/delete", categoryController.category_delete_post);

router.get("/category/:id/update", categoryController.category_update_get);

router.post("/category/:id/update", categoryController.category_update_post);

// Get list of all categories
router.get("/categories", categoryController.category_list);

// Get category detail
router.get("/category/:id", categoryController.category_detail);

/// ITEM ///

router.get("/item/create", itemController.item_create_get);

router.post("/item/create", itemController.item_create_post);

router.get("/item/:id/delete", itemController.item_delete_get);

router.post("/item/:id/delete", itemController.item_delete_post);

router.get("/item/:id/update", itemController.item_update_get);

router.post("/item/:id/update", itemController.item_update_post);

// Get list of all categories
router.get("/categories", itemController.item_list);

// Get item detail
router.get("/item/:id", itemController.item_detail);

module.exports = router;
