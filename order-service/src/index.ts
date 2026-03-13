import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get ("/",(req, res)=>{
    res.send ("Order Service is working")
})

app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
});

app.listen (port, ()=>{
    console.log (`Order Service is running at http://localhost:${port}`)
})
