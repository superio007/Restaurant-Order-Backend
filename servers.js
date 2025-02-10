const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db.js');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;

// API endpoint for fetching restaurants
// To get all restaurants
app.get("/api/restaurants", async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM restaurants");
        res.status(200).json({ data: result });
    } catch (err) {
        console.error("Error fetching restaurants:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});
// To get specific restaurant
app.get("/api/restaurants/:id", async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const [result] = await db.query("SELECT * FROM restaurants WHERE id = ?", [restaurantId]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json({ data: result[0] }); // Return first matching record
    } catch (err) {
        console.error("Error fetching restaurant:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});
// To delete specific restaurant (fixed method)
app.delete("/api/restaurants/:id", async (req, res) => {
    try {
        const restaurantId = Number(req.params.id); // Ensure it's a valid number

        if (!restaurantId) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const [result] = await db.query("DELETE FROM `restaurants` WHERE id = ?", [restaurantId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json({ message: "Restaurant deleted successfully" });

    } catch (err) {
        console.error("Error deleting restaurant:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});
// To add a new restaurant
app.post("/api/restaurants-add", async (req, res) => {
    try {
        const {id, name, cuisine, rating, image, location, priceRange } = req.body;

        // Validate input fields
        if (!name || !cuisine || !rating || !image || !location || !priceRange) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const query = "INSERT INTO restaurants (id,name, cuisine, rating, image, location, priceRange) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [id, name, cuisine, rating, image, location, priceRange];

        const [result] = await db.query(query, values);

        res.status(201).json({ message: "Restaurant added successfully", restaurantId: result.insertId });

    } catch (err) {
        console.error("Error adding restaurant:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});
// To update a specific restaurant
app.put("/api/restaurants-update/:id", async (req, res) => {
    try {
        const restaurantId = Number(req.params.id);
        const { name, cuisine, rating, image, location, priceRange } = req.body;

        // Validate restaurant ID
        if (isNaN(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        // Check if the restaurant exists before updating
        const [existingRestaurant] = await db.query("SELECT * FROM restaurants WHERE id = ?", [restaurantId]);

        if (existingRestaurant.length === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Update restaurant details
        const query = "UPDATE restaurants SET name = ?, cuisine = ?, rating = ?, image = ?, location = ?, priceRange = ? WHERE id = ?";
        const values = [name, cuisine, rating, image, location, priceRange, restaurantId];

        await db.query(query, values);

        res.status(200).json({ message: "Restaurant updated successfully" });

    } catch (err) {
        console.error("Error updating restaurant:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});

// API endpoint for fetching orders



app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
