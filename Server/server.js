import express from "express";
import nano from "nano";
import bodyParser from "body-parser";
import * as hpm from "http-proxy-middleware";
import path, { join } from "path";
import __dirname from "./modules/__dirname.js";

if (!process.env.ENVIRONMENT) {
  console.warn("NO DOTENV environment found, trying to load dotenv file...");
  const dotenv = await import("dotenv");
  dotenv.config();
}

//const couch = nano(process.env.COUCHDB_URL);
const couch = nano("http://admin:ILoveKats123@couchdb:5984");
const customerCollection = couch.use("customer");
const quoteCollection = couch.use("quote");

const PORT = process.env.PORT || 2025;
const APP = express();

APP.set("view engine", "ejs");
APP.set("views", path.join(__dirname, "views"));

APP.use(bodyParser.json());
APP.use(bodyParser.urlencoded({ extended: false }));

// Get all customers
APP.get("/api/customers", async (req, res) => {
  try {
    const result = await customerCollection.find({
      selector: {},
      fields: ["name", "email", "address", "_id"],
    });

    const customers = result.docs.map((doc) => ({
      name: doc.name,
      email: doc.email,
      address: {
        street: doc.address?.street || "Unknown",
        streetNumber: doc.address?.streetNumber || "Unknown",
        zipCode: doc.address?.zipCode || "Unknown",
        city: doc.address?.city || "Unknown",
      },
      _id: doc._id,
    }));

    res.json(customers);
  } catch (err) {
    console.error("Error fetching customers:", err.message);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

//get customer by id
APP.get("/api/customers/:id", async (req, res) => {
  const customerId = req.params.id;

  try {
    const customerDoc = await customerCollection.get(customerId);

    res.status(200).json({
      name: customerDoc.name,
      email: customerDoc.email,
      address: customerDoc.address,
    });
  } catch (err) {
    console.error("Error fetching customer:", err.message);
    if (err.statusCode === 404) {
      res.status(404).json({ error: "Customer not found" });
    } else {
      res
        .status(500)
        .json({ error: "Failed to fetch customer", details: err.message });
    }
  }
});

// Create customer
APP.post("/submit", async (req, res) => {
  const { name, email, address } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newCustomerDoc = {
    name,
    email,
    address,
    type: "customer",
    createdAt: new Date().toISOString(),
  };

  try {
    const result = await customerCollection.insert(newCustomerDoc);
    res.status(201).json({
      message: "Customer added successfully",
      customerId: result.id,
      rev: result.rev,
    });
  } catch (err) {
    console.error("Error inserting customer:", err);
    res.status(500).json({ error: "Failed to add customer" });
  }
});

//update customer information
APP.put("/api/customers/:id", async (req, res) => {
  const customerId = req.params.id;
  const { name, email, address } = req.body;

  // Validate required fields
  if (
    !name ||
    !email ||
    !address ||
    !address.street ||
    !address.streetNumber ||
    !address.zipCode ||
    !address.city
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get the current customer document from the database
    const customerDoc = await customerCollection.get(customerId);

    // Update the fields with new data
    customerDoc.name = name;
    customerDoc.email = email;
    customerDoc.address = {
      street: address.street,
      streetNumber: address.streetNumber,
      zipCode: address.zipCode,
      city: address.city,
    };

    // Save the updated document back to CouchDB
    const updatedDoc = await customerCollection.insert(customerDoc);

    res.status(200).json({
      message: "Customer updated successfully",
      customerId: updatedDoc.id,
      rev: updatedDoc.rev,
    });
  } catch (err) {
    console.error("Error updating customer:", err.message);
    if (err.statusCode === 404) {
      res.status(404).json({ error: "Customer not found" });
    } else {
      res
        .status(500)
        .json({ error: "Failed to update customer", details: err.message });
    }
  }
});

// Delete customer
APP.delete("/api/customers/:id", async (req, res) => {
  const customerId = req.params.id;

  try {
    const customerDoc = await customerCollection.get(customerId);
    await customerCollection.destroy(customerId, customerDoc._rev);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Error deleting customer:", err.message);
    if (err.statusCode === 404) {
      res.status(404).json({ error: "Customer not found" });
    } else {
      res
        .status(500)
        .json({ error: "Failed to delete customer", details: err.message });
    }
  }
});

// API Route to Fetch Quotes from CouchDB
APP.get("/api/quotes", async (req, res) => {
  try {
    // Query the updated view that emits full documents
    const result = await quoteCollection.view("quotes", "all", {
      include_docs: true,
    });

    // Extract the full documents (quotes) from the result
    const quotes = result.rows.map((row) => row.doc);

    // Send the quotes back to the client as JSON
    res.json(quotes);
  } catch (error) {
    console.error("Error fetching all quotes:", error);
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
});

// Add quote
APP.post("/api/save-offerte", async (req, res) => {
  const offerteData = req.body;

  try {
    //validate or transform data here
    const response = await quoteCollection.insert(offerteData);
    res.status(201).json({
      message: "Offerte succesvol opgeslagen!",
      id: response.id,
      rev: response.rev,
    });
  } catch (error) {
    console.error("Fout bij opslaan van offerte:", error);
    res
      .status(500)
      .json({ error: "Kon offerte niet opslaan", details: error.message });
  }
});

// Static files
APP.use(
  express.static(join(__dirname, "..", "client"), {
    setHeaders: (res) => {
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    },
  }),
);

// Proxy fallback
APP.use(
  "/",
  hpm.createProxyMiddleware({
    target: `http://localhost:${PORT}?`,
    changeOrigin: true,
    ws: true,
  }),
);

APP.listen(PORT, () => {
  console.log(`App running @ http://localhost:${PORT}`);
});
