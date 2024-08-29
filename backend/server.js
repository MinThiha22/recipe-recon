import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({origin: '*',}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/recipes", async (req, res) => {
    const { query, maxIngredients } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const response = await axios.get("https://api.edamam.com/search", {
            params: {
                q: query,
                ingr: maxIngredients || 20,
                app_id: process.env.EDAMAM_APP_ID,
                app_key: process.env.EDAMAM_APP_KEY,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Edamam API:", error.message);
        res.status(500).json({ error: "Failed to fetch data from Edamam API" });
    }
});

app.use((err, req, res, next) => {
    res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.BASE_URL}:${PORT}`);
});