const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  x1: {
    type: Number,
    required: true,
  },
  y1: {
    type: Number,
    required: true,
  },
  x2: {
    type: Number,
    required: true,
  },
  y2: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
});

const LayoutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  boundaries: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  rooms: [roomSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  user:{
    type: String,
    required: true,
  }
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
});

module.exports = mongoose.model("Layout", LayoutSchema);
