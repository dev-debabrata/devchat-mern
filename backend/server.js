import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";


const PORT = ENV.PORT || 5000;

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use(
    cors({
        origin: ENV.CLIENT_URL,
        credentials: true,
    })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log("Server running on port: " + PORT)
    connectDB()
});


// import path from "path";
// import { fileURLToPath } from "url";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.resolve();

// PRODUCTION FRONTEND SERVE
// if (process.env.NODE_ENV === "production") {
//     const pathToFrontend = path.join(__dirname, '..', 'frontend', 'dist');

//     app.use(express.static(pathToFrontend));

//     app.get(/.*/, (req, res) => {
//         res.sendFile(path.resolve(pathToFrontend, "index.html"));
//     });
// }