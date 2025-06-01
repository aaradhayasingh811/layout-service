const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/token.js");
const {
  getAllLayouts,
  getLayoutById,
  createLayout,
  saveLayout,
  deleteLayout,
  getHomeParameters,
} = require("../controllers/layout.controllers.js");

// add verfify wala baad me
router.get("/all-layout",verifyToken, getAllLayouts);
router.get("/layout/:id",getLayoutById);
router.get("/home-parameters/:id",verifyToken,getHomeParameters);
router.post("/create-layout",verifyToken, createLayout);
router.post("/save-layout",verifyToken, saveLayout);
router.delete("/delete-layout/:id", verifyToken, deleteLayout);

module.exports = router;
