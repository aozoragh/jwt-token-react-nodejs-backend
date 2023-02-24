const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const passport = require("passport");
const path = require("path");
//@import

require("dotenv").config();
const app = express();

// Init Middleware
// app.use(cors());
// app.use(
//   cors({
//     origin: ["https://www.section.io", "http://localhost:3000"],
//   })
// );

var corsOption = {
  origin: `*`,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  credentials: true,
  exposedHeaders: ["x-auth-token"],
  url: [
    "https://localhost:3000",
  ],
};
app.use(cors(corsOption));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Passport middleware
// app.use(passport.initialize());

// Passport Config
// require("./config/passport")(passport);
// Define Routes
app.use("/users", require("./routes/users"));

// Serve static assets in productioncd
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
