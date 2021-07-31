require("dotenv").config();
require("./auth/auth.js");
// modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8001;

// routes
const loginRouter = require("./routes/login");
const profileRouter = require("./routes/profile");
const registerRouter = require("./routes/register");
const apiRouter = require("./routes/api");
const timeslotsRouter = require("./routes/timeslots")
const coursesRouter = require("./routes/courses");

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = process.env.DATABASE_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;

connection.on("error", (error) => {
	console.log("MongoDB database connection error", error);
	mongoose.disconnect();
});

connection.once("open", () => {
	console.log("MongoDB database connection established successfully");
});

// Routers
app.use("/", loginRouter);
app.use("/", registerRouter);
app.use("/", timeslotsRouter);
app.use("/", coursesRouter);

// For internal use only
app.use("/", apiRouter);

// For logged in (and authenticated) users only
app.use("/", passport.authenticate("jwt", {session: false}), profileRouter);

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
