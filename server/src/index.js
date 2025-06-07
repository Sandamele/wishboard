import express from "express";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import "./config/auth/passport.js";
import { formatResponse } from "./utils/formatResponse.js";
import userRoutes from "./routes/users.routes.js";
import productRoutes from "./routes/products.routes.js";
import { STANDARD_MESSAGES } from "./utils/statusMessage.js";
import { authentication } from "./middleware/authentication.js";
const PORT = process.env.PORT || 1338;

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Check the health of the app
app.get("/health", (req, res) => {
  const data = { message: "health" };
  return formatResponse(
    res,
    200,
    STANDARD_MESSAGES["FETCH_SUCCESS"],
    data
  );
});

// Root endpoint - basic welcome message
app.get("/", (req, res) => {
  const data = {
    message: "wishboard server online",
  };
  return formatResponse(
    res,
    200,
    STANDARD_MESSAGES["FETCH_SUCCESS"],
    data
  );
});

// Verson 1
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", authentication, productRoutes);
// Catch-all handler for any routes not matched above
// Responds with a 404 Not Found and standard message
app.use((req, res) => {
  return formatResponse(res, 404, STANDARD_MESSAGES["NOT_FOUND"]);
});

app.listen(PORT, () => {
  console.log(
    `Server running on ${PORT}\nurl: http://localhost:${PORT}`
  );
});
