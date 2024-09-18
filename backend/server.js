import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 80;


app.use(cors({origin: '*',}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/recipeSearch/default", async (req, res) => {
    const { query, amount} = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }
    try {
        const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
            params: {
                query: query,
                number: amount || 10,
                apiKey: process.env.SPOONACULAR_API_KEY
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Spoonacular API:", error.message);
        res.status(500).json({ error: "Failed to fetch data from Spoonacular API" });
    }
});

app.get("/api/recipeSearch/ingredients", async (req, res) => {
    const { query, ingredients, amount } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }
    try {
        const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
            params: {
                query: query,
                number: amount || 10,
                includeIngredients: ingredients,
                sort: min-missing-ingredients,
                apiKey: process.env.SPOONACULAR_API_KEY
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Spoonacular API:", error.message);
        res.status(500).json({ error: "Failed to fetch data from Spoonacular API" });
    }
});

app.get("/api/ingredientsSearch", async (req, res) => {
    const { query, amount } = req.query;
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const response = await axios.get("https://api.spoonacular.com/recipes/findByIngredients", {
            params: {
                ingredients: query,
                number: amount || 10,
                ranking: 2,
                apiKey: process.env.SPOONACULAR_API_KEY
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Spoonacular API:", error.message);
        res.status(500).json({ error: "Failed to fetch data from Spoonacular API" });
    }
});

app.get("/api/recipeInfo/default", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${query}/information`, {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Spoonacular API:", error.message);
        res.status(500).json({ error: "Failed to fetch data from Spoonacular API" });
    }
});

app.get("/api/recipeSearch/random", async (req, res) => {
    const { query } = req.query;

    try {
        const response = await axios.get("https://api.spoonacular.com/recipes/random", {
            params: {
                number: 10,
                apiKey: process.env.SPOONACULAR_API_KEY
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Spoonacular API:", error.message);
        res.status(500).json({ error: "Failed to fetch data from Spoonacular API" });
    }
});

app.use((err, req, res, next) => {
    res.status(500).send("Something went wrong!");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on ${process.env.BASE_URL}:${PORT}`);
});
