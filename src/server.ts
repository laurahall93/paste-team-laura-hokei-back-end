import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/", async (_req, res) => {
    res.json({ msg: "Hello! There's nothing interesting for GET /" });
});

app.get("/pastes", async (_req, res) => {
    try {
        const text =
            "SELECT id,title, LEFT(body,50)AS body FROM pasteBin ORDER BY (id) DESC LIMIT 10";
        const result = await client.query(text);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error({ message: (error as Error).message });
    }
});

app.get("/pastes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const text = "SELECT * FROM pasteBin WHERE id = $1";
        const value = [id];
        const result = await client.query(text, value);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error({ message: (error as Error).message });
    }
});

app.get("/pastes/:id/comments", async (req, res) => {
    try {
        const id = req.params.id;
        const text = " SELECT * FROM commentSubmit WHERE pasteBinId = $1";
        const value = [id];
        const result = await client.query(text, value);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error({ message: (error as Error).message });
    }
});

app.post("/pastes/", async (req, res) => {
    try {
        const data = req.body;
        const text =
            "INSERT INTO pasteBin (title, body) VALUES($1, $2) RETURNING *";
        const value = [data.title, data.body];
        const result = await client.query(text, value);
        res.status(201).json(result.rows);
        console.log("Data added to DB");
    } catch (error) {
        console.error({ message: (error as Error).message });
    }
});

app.get("/health-check", async (_req, res) => {
    try {
        //For this to be successful, must connect to db
        await client.query("select now()");
        res.status(200).send("system ok");
    } catch (error) {
        //Recover from error rather than letting system halt
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
    console.log("Attempting to connect to db");
    await client.connect();
    console.log("Connected to db!");

    const port = getEnvVarOrFail("PORT");
    app.listen(port, () => {
        console.log(
            `Server started listening for HTTP requests on port ${port}.  Let's go!`
        );
    });
}
