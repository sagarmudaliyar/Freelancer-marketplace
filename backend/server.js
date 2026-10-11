const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));


/* ==============================
   TABLES IN YOUR DATABASE
================================ */

const allowedTables = [
    "users",
    "clients",
    "freelancers",
    "skills",
    "freelancer_skills",
    "projects",
    "bids",
    "payments",
    "reviews"
];


/* ==============================
   TEST CONNECTION
================================ */

app.get("/api/test", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            message: "Website connected to PostgreSQL",
            time: result.rows[0].now
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });

    }

});


/* ==============================
   DATABASE INFORMATION
================================ */

app.get("/api/tables", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to read database tables"
        });

    }

});


/* ==============================
   GET DATA FROM ANY OF 9 TABLES
================================ */

app.get("/api/table/:tableName", async (req, res) => {

    const tableName = req.params.tableName;

    if (!allowedTables.includes(tableName)) {

        return res.status(400).json({
            error: "Invalid table name"
        });

    }

    try {

        const result = await pool.query(
            `SELECT * FROM "${tableName}" LIMIT 100`
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to fetch table data"
        });

    }

});


/* ==============================
   GET CLIENTS
================================ */

app.get("/api/clients", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                client_id,
                name,
                email,
                phone,
                company_name,
                user_id
            FROM clients
            ORDER BY client_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to fetch clients"
        });

    }

});


/* ==============================
   ADD CLIENT
================================ */

app.post("/api/clients", async (req, res) => {

    const {
        name,
        email,
        phone,
        company_name,
        user_id
    } = req.body;

    if (!name || !email) {

        return res.status(400).json({
            error: "Name and email are required"
        });

    }

    try {

        const result = await pool.query(
            `
            INSERT INTO clients
            (name, email, phone, company_name, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                name,
                email,
                phone || null,
                company_name || null,
                user_id || null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});


/* ==============================
   GET PROJECTS
================================ */

app.get("/api/projects", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                project_id,
                title,
                description,
                budget,
                status,
                start_date,
                deadline,
                client_id
            FROM projects
            ORDER BY project_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to fetch projects"
        });

    }

});


/* ==============================
   ADD PROJECT
================================ */

app.post("/api/projects", async (req, res) => {

    const {
        title,
        description,
        budget,
        status,
        start_date,
        deadline,
        client_id
    } = req.body;

    if (!title || !client_id) {

        return res.status(400).json({
            error: "Project title and client ID are required"
        });

    }

    try {

        const result = await pool.query(
            `
            INSERT INTO projects
            (
                title,
                description,
                budget,
                status,
                start_date,
                deadline,
                client_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [
                title,
                description || null,
                budget || null,
                status || null,
                start_date || null,
                deadline || null,
                client_id
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});


/* ==============================
   START SERVER
================================ */

app.listen(PORT, () => {

    console.log("-----------------------------------");
    console.log("Freelancer Marketplace");
    console.log("-----------------------------------");
    console.log(`Website: http://localhost:${PORT}`);
    console.log("Backend: Node.js + Express");
    console.log("Database: PostgreSQL");
    console.log("-----------------------------------");

});