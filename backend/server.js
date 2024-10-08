import express, { query } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import * as tf from '@tensorflow/tfjs';
import mobilenet from '@tensorflow-models/mobilenet';
import sharp from "sharp";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;


app.use(cors({origin: '*',}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/recipeSearch", async (req, res) => {
    const { query, ingredients, sort } = req.query;

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
                sort: sort,
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

let model = null;
const upload = multer({ storage: multer.memoryStorage() });

const loadModel = async () => {
    await tf.ready();
    model = await mobilenet.load({
        version: 2,
        alpha: 1.0,
    })
}

loadModel();
app.post("/api/imageRecognition", upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    if(!model){
        return res.status(400).json({ error: "Model is not loaded"})
    }

    try {
        console.log("Received file:", req.file.originalname);

        // Process the image buffer using sharp
        const imageBuffer = await sharp(req.file.buffer)
            .resize({ width: 224, height: 224 })
            .toFormat('png')
            .toBuffer();

        // Decode the image buffer into a Tensor
        const imageTensor = tf.node.decodeImage(imageBuffer, 3)
            .expandDims(0)  // Add a batch dimension
            .toFloat()
            .div(tf.scalar(255)); // Normalize the image

        // Run image classification using the MobileNet model
        const predictions = await model.classify(imageTensor);

        // Send the predictions as the response
        console.log("Model predictions:", predictions);
        res.status(200).json(predictions);

    } catch (error) {
        console.error("Error classifying the image:", error.message);
        res.status(500).json({ error: "Failed to classify image" });
    }
});


app.use((err, req, res, next) => {
    res.status(500).send("Something went wrong!");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on ${process.env.BASE_URL}:${PORT}`);
});
