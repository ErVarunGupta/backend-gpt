import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db/dbConnection.js";
import { GeminiConnection } from "./gemini/GeminiConnection.js";
import { getGeminiAIResponse } from "./utils/GeminiAI.js";
import chatRoute from './routes/chat.router.js'
import authRoute from './routes/auth.router.js'


dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use('/api',chatRoute);
app.use('/user',authRoute);

app.get("/test", async(req, res)=>{
  res.send({
    message: "LATEST TEST UPDATE: test was successful!"
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  dbConnection();
});

// app.post("/test", GeminiConnection);
app.post('/test', getGeminiAIResponse)
