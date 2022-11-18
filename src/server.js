require("express-async-errors")
const express = require ("express");

const app = express();

app.use(express.json());

const AppError = require("./utils/AppError");
const migrateRun = require("./database/sqlite/migrations")
migrateRun()

const router = require("./routes");
app.use(router)


app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });

    }
    console.error(error)

    return response.status(500).json({
        status: "error",
        message: "Internal error server"
    });
})



const PORT = 3333;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));''