<<<<<<< HEAD
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


=======
import express, { query } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";

dotenv.config();

>>>>>>> main
const app = express();
const PORT = process.env.PORT || 80;


app.use(cors({origin: '*',}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/recipeSearch", async (req, res) => {
    const { query, ingredients } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }
    try {
        const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
            params: {
                query: query,
                number: 10,
                includeIngredients: ingredients,
                fillIngredients: true,
                sort: 'min-missing-ingredients',
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
    const { ingredients } = req.query;
    if (!ingredients) {
        return res.status(400).json({ error: "Ingredients parameter is required" });
    }

    try {
        const response = await axios.get("https://api.spoonacular.com/recipes/findByIngredients", {
            params: {
                ingredients: ingredients,
                number: 10,
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

app.get("/api/recipeInfo", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${query}/information`, {
            params: {
                id: query,
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


const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/imageRecognition", upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        console.log("Received file:", req.file.originalname);

        // Create a new FormData instance
        const formData = new FormData();
        
        // Append the file buffer directly to formData
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // Send the file to Spoonacular API
        const response = await axios.post(
            'https://api.spoonacular.com/food/images/classify',
            formData,
            {
                params: {
                    apiKey: process.env.SPOONACULAR_API_KEY
                },
                headers: {
                    ...formData.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        console.log("Spoonacular API response:", response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Spoonacular API:", error.message);
        if (error.response) {
            console.error("Spoonacular API error response:", error.response.data);
        }
        res.status(500).json({ error: "Failed to fetch data from Spoonacular API" });
    }
});


app.use((err, req, res, next) => {
    res.status(500).send("Something went wrong!");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on ${process.env.BASE_URL}:${PORT}`);
});
