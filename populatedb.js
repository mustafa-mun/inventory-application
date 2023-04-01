#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  try {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
}

async function categoryCreate(name) {
  try {
    const category = new Category({ name: name });
    await category.save();
    categories.push(category);
    console.log(`Added category: ${name}`);
  } catch (error) {
    console.log(error);
  }
}

async function itemCreate(
  name,
  description,
  category,
  price,
  number_in_stocks
) {
  try {
    itemdetail = {
      name,
      description,
      price,
      number_in_stocks,
    };
    if (category) itemdetail.category = category;

    const item = new Item(itemdetail);
    await item.save();
    items.push(item);
    console.log(`Added item: ${name}`);
  } catch (error) {
    console.log(error);
  }
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("Weight&Barbells"),
    categoryCreate("Strength"),
    categoryCreate("Conditioning"),
    categoryCreate("Cardio"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      itemCreate(
        "Adjustable bench",
        "Versatile bench for a variety of workouts, including bench presses and dumbbell flys. Adjustable to multiple angles for a range of exercises and intensities",
        categories[0],
        365.5,
        4
      ),
      itemCreate(
        "Squat rack",
        "Provides a secure and stable base for lifting heavy weights during leg exercises. Adjustable height for customized use",
        categories[0],
        500,
        3
      ),
      itemCreate(
        "Functional training machine",
        "Full-body workout equipment that offers a variety of exercises, including pull-ups, dips, and leg raises. Saves space and time by combining multiple pieces of equipment into one.",
        categories[0],
        1695.5,
        2
      ),
      itemCreate(
        "Chin-up bar",
        "Provides a sturdy and secure base for performing pull-ups and chin-ups. Adjustable height for customized use",
        categories[1],
        135,
        6
      ),
      itemCreate(
        "Power band package",
        "Set of power bands in different resistances for a variety of exercises and intensities, including pull-ups and resistance training",
        categories[1],
        44,
        9
      ),
      itemCreate(
        "Dips bar",
        "Provides a sturdy and secure base for performing dips and other bodyweight exercises. Adjustable height for customized use",
        categories[1],
        79.5,
        7
      ),
      itemCreate(
        "Treadmill",
        "Cardio workout equipment with a range of speeds and inclines for a variety of workout intensities. Sturdy construction ensures stability and safety during workouts",
        categories[2],
        2500,
        3
      ),
      itemCreate(
        "Rower",
        "Low-impact cardio workout equipment for a full-body workout and improved cardiovascular health and endurance. Sturdy construction ensures stability and safety during workouts",
        categories[2],
        1259,
        2
      ),
      itemCreate(
        "Exercise bike",
        "Low-impact cardio workout equipment with a range of resistance levels for a variety of workout intensities. Sturdy construction ensures stability and safety during workouts",
        categories[2],
        679,
        4
      ),
      "20 kg barbell",
      "High-quality, sturdy barbell for weightlifting and strength training. Ideal for intermediate to advanced lifters",
      categories[3],
      150,
      10
    ),
    itemCreate(
      "15 kg barbell",
      "Similar to the 20 KG barbell but with a lighter weight. Ideal for beginners or those who prefer a lighter load for their workouts",
      categories[3],
      115,
      8
    ),
    itemCreate(
      "40 kg adjustable dumbell pair",
      "Convenient and versatile dumbbell set that can be adjusted from 5 KG to 40 KG. Saves space and money by eliminating the need for multiple dumbbell sets",
      categories[3],
      170,
      5
    ),
  ]);
}
