const Item = require("../models/item");

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
      collection: results,
    });
  });
};

exports.item_detail = (req, res, next) => {
  async function findItem() {
    try {
      const item = await Item.findOne({ _id: req.params.id }).populate("category");
      return item
    } catch (error) {
      return next(error)
    }
  }

  findItem().then((result) => {
    res.render("item_detail", { item: result });
  });
};

exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create get");
};

exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create post");
};

exports.item_delete_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: Item delete id ${req.params.id}`);
};

exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete post");
};

exports.item_update_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: Item update id ${req.params.id}`);
};

exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update post");
};
