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
// Get all orders
app.get("/api/orders", async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM orders");
        res.status(200).json({ data: result });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});

// Get a specific order by ID
app.get("/api/orders/:id", async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        if (isNaN(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const [result] = await db.query("SELECT * FROM orders WHERE id = ?", [orderId]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ data: result[0] });
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});

// Add a new order
app.post("/api/orders-add", async (req, res) => {
    try {
        const { id, table_number, items, name, total, status, time, notes, restaurant_id } = req.body;

        if (!table_number || !items || !name || !total || !status || !time || !restaurant_id) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const query = "INSERT INTO orders (id, table_number, items, name, total, status, time, notes, restaurant_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [id, table_number, items, name, total, status, time, notes, restaurant_id];

        const [result] = await db.query(query, values);

        res.status(201).json({ message: "Order added successfully", orderId: result.insertId });
    } catch (err) {
        console.error("Error adding order:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});

// Update an existing order
app.put("/api/orders-update/:id", async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const {id, table_number, items, name, total, status, time, notes, restaurant_id } = req.body;

        if (isNaN(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const [existingOrder] = await db.query("SELECT * FROM orders WHERE id = ?", [orderId]);

        if (existingOrder.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const query = "UPDATE orders SET id = ?, table_number = ?, items = ?, name = ?, total = ?, status = ?, time = ?, notes = ?, restaurant_id = ? WHERE id = ?";
        const values = [id, table_number, items, name, total, status, time, notes, restaurant_id, orderId];

        await db.query(query, values);

        res.status(200).json({ message: "Order updated successfully" });
    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});

// Delete an order
app.delete("/api/orders/:id", async (req, res) => {
    try {
        const orderId = Number(req.params.id);

        if (isNaN(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const [result] = await db.query("DELETE FROM orders WHERE id = ?", [orderId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});

// API endpoint for fetching Menu Items
//  Get all menu items
app.get("/api/menu-items", async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM menu_items");
        res.status(200).json({ data: result });
    } catch (err) {
        console.error("Error fetching menu items:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});

app.get("/api/menu-items/:restaurantId", async (req, res) => {
    try {
        const restaurantId = Number(req.params.restaurantId);
        if (isNaN(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const [result] = await db.query("SELECT * FROM menu_items WHERE restaurantId = ?", [restaurantId]);

        if (result.length === 0) {
            return res.status(404).json({ message: "No menu items found for this restaurant" });
        }

        res.status(200).json({ data: result });  // Return all menu items
    } catch (err) {
        console.error("Error fetching menu items:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});


//  Add a new menu item
app.post("/api/menu-items-add", async (req, res) => {
    try {
        const { id, name, price, category, available, restaurant_id } = req.body;

        if (!name || !price || !category || available === undefined || !restaurant_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const query = "INSERT INTO menu_items (id, name, price, category, available, restaurant_id) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [id, name, price, category, available, restaurant_id];

        const [result] = await db.query(query, values);

        res.status(201).json({ message: "Menu item added successfully", menuItemId: result.insertId });
    } catch (err) {
        console.error("Error adding menu item:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});

//  Update an existing menu item
app.put("/api/menu-items-update/:id", async (req, res) => {
    try {
        const menuItemId = Number(req.params.id);
        const {id, name, price, category, available, restaurant_id } = req.body;

        if (isNaN(menuItemId)) {
            return res.status(400).json({ message: "Invalid menu item ID" });
        }

        const [existingMenuItem] = await db.query("SELECT * FROM menu_items WHERE id = ?", [menuItemId]);

        if (existingMenuItem.length === 0) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        const query = "UPDATE menu_items SET id = ?, name = ?, price = ?, category = ?, available = ?, restaurant_id = ? WHERE id = ?";
        const values = [id,name, price, category, available, restaurant_id, menuItemId];

        await db.query(query, values);

        res.status(200).json({ message: "Menu item updated successfully" });
    } catch (err) {
        console.error("Error updating menu item:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});

//  Delete a menu item
app.delete("/api/menu-items/:id", async (req, res) => {
    try {
        const menuItemId = Number(req.params.id);

        if (isNaN(menuItemId)) {
            return res.status(400).json({ message: "Invalid menu item ID" });
        }

        const [result] = await db.query("DELETE FROM menu_items WHERE id = ?", [menuItemId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (err) {
        console.error("Error deleting menu item:", err);
        res.status(500).json({ error: err.message, message: "Something went wrong" });
    }
});


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
