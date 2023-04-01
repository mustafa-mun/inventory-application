const Category = require("../models/category")

// Home page
exports.index = (req, res) => {
  res.send("NOT IMPLEMENTED: Home page")
}
// Display list of all books.
exports.category_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Category list");
};

exports.category_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Category detail id ${req.params.id}`);
}

exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create get");
}

exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create post");
}

exports.category_delete_get = (req ,res) => {
  res.send(`NOT IMPLEMENTED: Category delete id ${req.params.id}`)
}

exports.category_delete_post = (req ,res) => {
  res.send("NOT IMPLEMENTED: Category delete post");
}

exports.category_update_get = (req ,res) => {
  res.send(`NOT IMPLEMENTED: Category update id ${req.params.id}`)
}

exports.category_update_post = (req ,res) => {
  res.send("NOT IMPLEMENTED: Category update post");
}