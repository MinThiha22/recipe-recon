import express, { query } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import vision from "@google-cloud/vision";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/recipeSearch", async (req, res) => {
  const { query, ingredients, sort, isVegetarian, isVegan, isGlutenFree } =
    req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  // Initialize params object for Spoonacular API request
  const params = {
    query: query,
    number: 10,
    includeIngredients: ingredients,
    fillIngredients: true,
    sort: sort,
    apiKey: process.env.SPOONACULAR_API_KEY,
  };

  // Apply dietary filters
  if (isVegan === "true") {
    params.diet = "vegan";
  } else if (isVegetarian === "true") {
    params.diet = "vegetarian";
  }

  // Add Gluten-Free filter if applied
  if (isGlutenFree === "true") {
    params.intolerances = "gluten";
  }
  console.log(params);

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      { params }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from Spoonacular API:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch data from Spoonacular API" });
  }
});

app.get("/api/ingredientsSearch", async (req, res) => {
  const { ingredients } = req.query;
  if (!ingredients) {
    return res.status(400).json({ error: "Ingredients parameter is required" });
  }

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          ingredients: ingredients,
          number: 10,
          ranking: 2,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from Spoonacular API:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch data from Spoonacular API" });
  }
});

app.get("/api/recipeInfo", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${query}/information`,
      {
        params: {
          id: query,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from Spoonacular API:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch data from Spoonacular API" });
  }
});

// UPDATE START
app.get("/api/recipeSearch/random", async (req, res) => {
  const { isVegan, isVegetarian, isGlutenFree } = req.query; // Fetch dietary filters from the query

  // Initialize params for the API request
  const params = {
    number: 10,
    apiKey: process.env.SPOONACULAR_API_KEY,
  };

  // Apply dietary filters
  if (isVegan === "true") {
    params.diet = "vegan";
  } else if (isVegetarian === "true") {
    params.diet = "vegetarian";
  }

  if (isGlutenFree === "true") {
    params.intolerances = "gluten";
  }

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/random",
      { params }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from Spoonacular API:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch data from Spoonacular API" });
  }
});
// UPDATED END

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/imageRecognition", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    console.log("Received file:", req.file.originalname);

    // Create a Google Vision client
    const client = new vision.ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Prepare the image data
    const image = {
      content: req.file.buffer.toString("base64"),
    };

    //Feature to detect
    const features = [{ type: "LABEL_DETECTION" }];

    // Send the request to Google Vision
    const [response] = await client.annotateImage({ image, features });

    console.log("Google Vision API response:", response);

    // Extract description and score
    const data = response.labelAnnotations.map((item) => ({
      description: item.description,
      score: item.score,
    }));

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error using Google Vision:", error.message);
    res
      .status(500)
      .json({ error: "Failed to process image with Google Vision" });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${process.env.BASE_URL}:${PORT}`);
});
