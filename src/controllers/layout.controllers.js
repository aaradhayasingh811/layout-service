const express = require("express");
const Layout = require("../models/layout.model.js");
const allocateRooms = require("../utils/layoutGenerator.js");
const inferInputFromOutput = require("../utils/parameterGenerator.js");
const getAllLayouts = async (req, res) => {
  try {
    const layouts = await Layout.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    if (!layouts || layouts.length === 0) {
      return res.status(404).json({ message: "No layouts found" });
    }

    res.status(200).json({ message: "All the layouts are", layouts });
  } catch (error) {
    console.error("Error fetching layouts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLayoutById = async (req, res) => {
  const layoutId = req.params.id;

  try {
    const layout = await Layout.findById(layoutId);
    if (!layout) {
      return res.status(404).json({ message: "Layout not found" });
    }
    res.status(200).json({ message: "Layout found", layout });
  } catch (error) {
    console.error("Error fetching layout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createLayout = async (req, res) => {
  try {
    const { width, height, master_rooms, bathrooms, cars, bikes } = req.body;

    if (!width || !height) {
      return res.status(400).json({ error: "Width and height are required." });
    }

    const layout = allocateRooms(
      Number(width),
      Number(height),
      Number(master_rooms || 1),
      Number(bathrooms || 1),
      Number(cars || 0),
      Number(bikes || 0)
    );

    res.json({layout, message: "Layout created successfully"});
  } catch (error) {
    console.error("Error creating layout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveLayout = async (req, res) => {
    try {
        const { name, description, boundaries, rooms } = req.body;
    
        if (!name || !boundaries || !rooms) {
        return res.status(400).json({ error: "Name, boundaries, and rooms are required." });
        }

        // console.log(req.body);
    
        const layout = new Layout({
        name,
        description,
        boundaries,
        rooms,
        user: String(req.user.id) 
        });
    
        await layout.save();
        res.status(201).json({ message: "Layout saved successfully", layout });
    } catch (error) {
        console.error("Error saving layout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteLayout = async (req, res) => {
  const layoutId = req.params.id;

  try {
    const layout = await Layout.findByIdAndDelete(layoutId);
    if (!layout) {
      return res.status(404).json({ message: "Layout not found" });
    }
    res.status(200).json({ message: "Layout deleted successfully" });
  } catch (error) {
    console.error("Error deleting layout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getHomeParameters = async (req, res) => {
  const layoutId = req.params.id;
  try {
    const layout = await Layout.findById(layoutId);
    if (!layout) {
      return res.status(404).json({ message: "Layout not found" });
    }

    const data = inferInputFromOutput(layout);
    // console.log(data);
    res.status(200).json({ message: "Home parameters fetched successfully", data });
    
  } catch (error) {
    console.error("Error fetching home parameters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllLayouts,
  getLayoutById,
  createLayout,
  saveLayout,
  deleteLayout,
  getHomeParameters
};