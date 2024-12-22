const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://ons:ons1997@cluster0.o7pox.mongodb.net/Ecommerce?retryWrites=true&w=majority&tls=true"
);

//API Creation

app.get("/", (req, res) => {
  res.send("Express App is Running ");
});

//Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

//Creating upload endpoint for images

app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  console.log("File received:", req.file);
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//Schema for creating products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

//schema for user model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    Unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//cerating endpoint for register users
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, errors: "existing user with this email Id " });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();
  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});
//creating endpoint for newcollection data

app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("newcollection fetched");
  res.send(newcollection);
});
//creating endpoint for popular in woman section

app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("popular_in_women fetched");
  res.send(popular_in_women);
});
// creating middleware for fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};
// creating endpoint for get cartdata
app.get("/getcart", fetchUser, async (req, res) => {
  console.log("Get cart data");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json({ success: true, cartData: userData.cartData });
});

//creating endpoint for remove product from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("remove from cart", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] === 0) {
    return res.json({ success: false, message: "Item not in cart" });
  }
  userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json({ success: true, message: "Item removed from cart" });
});
//creating endpoint for adding to cartdata
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("Add to cart", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json({ success: true, message: "Item added to cart" });
});
//cerating endpoint for login users
app.post("/login", async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email });

    if (user) {
      const passCompare = req.body.password === user.password;
      if (passCompare) {
        const data = { user: { id: user.id } };
        const token = jwt.sign(data, "secret_ecom");
        return res.json({ success: true, token });
      } else {
        return res.json({ success: false, errors: "wrong password" });
      }
    }

    return res.json({ success: false, errors: "wrong email ID" });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// add product
app.post("/addproduct", async (req, res) => {
  try {
    let lastProduct = await Product.findOne().sort({ id: -1 }).exec();
    let id = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();

    console.log("Product saved:", product);

    res.json({
      success: true,
      message: "Product added successfully.",
      product: product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

// Get All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

// Delete Product by ID
app.delete("/deleteproduct/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await Product.deleteOne({ _id: productId });
    if (result.deletedCount > 0) {
      res.json({ success: true, message: "Product deleted successfully." });
    } else {
      res.status(404).json({ success: false, message: "Product not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Update Product by ID
app.put("/updateproduct/:id", async (req, res) => {
  const productId = req.params.id;
  const updates = req.body;
  console.log(productId);

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      updates,
      { new: true }
    );

    if (updatedProduct) {
      res.json({
        success: true,
        message: "Product updated successfully.",
        product: updatedProduct,
      });
    } else {
      res.status(404).json({ success: false, message: "Product not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("server running on port " + port);
  } else {
    console.log("error : " + error);
  }
});
