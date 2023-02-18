const express = require("express");
const csvController = require("../controllers/csvController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("CSVFile")) {
      fs.mkdirSync("CSVFile");
    }

    if (!fs.existsSync("CSVFile/csv")) {
      fs.mkdirSync("CSVFile/csv");
    }

    cb(null, "CSVFile/csv");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".csv") {
      return cb(new Error("Only csv's are allowed!"));
    }

    cb(null, true);
  },
});

const router = express.Router();


router.put(
  "/admin5",
  upload.single('CSVFile'),
  csvController.create,
  // csvController.del
);

router.post(
  "/del",
  upload.single('CSVFile'),
  csvController.del,
)

router.get("/getStock",csvController.stock);

router.get('/count', csvController.count1);

module.exports = router;