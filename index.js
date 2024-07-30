const express = require("express");
require("./connection");
const multer = require("multer");
const bcrypt = require("bcrypt");
const userModel = require("./userModel");
const app = express();
const imageModel = require("./imageModel");
const path = require('path');

const cors = require("cors");
app.use(cors());

app.use('/image', express.static(path.join(__dirname, 'public/image')));
const port = process.env.PORT || 8000;

//using middleware for excessing the values
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to home page");
});

app.post("/createUser", async (req, res) => {
  try {
    const responseData = new userModel(req.body);
    await responseData.save();
    console.log(responseData);
    res.status(201).send({ status: 201, msg: "Data is inserted" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: 500, err: "server error" });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userData = await userModel.findOne({ email });
    const isMatched = await bcrypt.compare(password, userData.password);
    if (isMatched) {
      res.status(200).send({ msg: "Login Successfully", status: 200 });
    } else {
      res.status(404).send({ msg: "User not Found", status: 404 });
    }
  } catch (e) {
    res.status(500).send({ err: "Server Error", status: 500 });
  }
});

app.put("/updateUser/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    //this will update the data referencing the respective id
    const responseData = await userModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    responseData
      ? res.status(201).send({ msg: "Data Updated" })
      : res.status(404).send({ msg: "Data Not Updated" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ err: "Server Error..." });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  const _id = req.params.id;
  // console.log(id);

  try {
    //this will delete the data referencing the respective id
    const responseData = await userModel.findByIdAndDelete(_id);
    if (responseData) {
      res.status(201).send({ msg: "Data Deleted" });
    } else {
      res.status(404).send({ msg: "Data Not Deleted" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ err: "Server Error..." });
  }
});

// app.delete("/deleteUser", async (req, res) => {
//   const { name } = req.body;
//   try {
//     const deleteResultData = await userModel.deleteOne({ name: name });

//     if (deleteResultData) {
//       res.status(201).send({ message: "User deleted successfully" });
//     } else {
//       res.status(404).send({ message: "User not found" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({ error: "Server error" });
//   }
// });

app.get("/GetUser", async (req, res) => {
  try {
    const responseData = await userModel.find();
    console.log(responseData);
    if (responseData) {
      res.status(201).send(responseData);
    } else {
      res.status(404).send({ err: "User Not Found!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ err: "Server Error..." });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/uploadImage", upload.single("file"), async (req, res) => {
  const file = req.file.filename; // Use req.file.filename to get the full path with the unique suffix
  console.log(file);
  try {
    const resData = await new imageModel({ image: file });
    await resData.save();
    res.send("Uploaded success...");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Server error" });
  }
});


app.get("/getImage", async (req, res) => {
  try {
    const resData = await imageModel.find();
    console.log(resData)
    res.send(resData);
  } catch (e) {
    console.log(e);
  }
});
app.listen(port, (req, res) => {
  console.log(`Server is running in port ${port}`);
});
