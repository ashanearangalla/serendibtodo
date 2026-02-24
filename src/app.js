import express from "express";
import cors from "cors";
import sequelize from "./db/index.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)

// middlewares
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

// 2️⃣ create tables
await sequelize.sync({ alter: true }); 
// alter:true updates structure without deleting data

console.log("Tables created successfully");

// import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

// routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);

export {app};