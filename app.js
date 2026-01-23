const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    cors({
        origin: "http://localhost:3001",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));



app.use(errorHandler);

module.exports = app;
