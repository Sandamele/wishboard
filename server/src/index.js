import express from 'express';
import morgan from "morgan";
import { formatResponse } from './utils/formatResponse.js';
import userRoutes from "./routes/users.routes.js";
import { STANDARD_MESSAGES } from './utils/statusMessage.js';
const PORT = process.env.PORT || 1338;

const app = express();

app.use(express.json());
app.use(morgan("dev"))

// Check the health of the app
app.get('/health', (req, res) => {
  const data = { message: 'health' };
  return formatResponse(res, 200, STANDARD_MESSAGES['FETCH_SUCCESS'], data);
});

// Root endpoint - basic welcome message
app.get('/', (req, res) => {
  const data = { message: 'wishboard server online' };
  return formatResponse(res, 200, STANDARD_MESSAGES['FETCH_SUCCESS'], data);
});

// Verson 1
app.use("/api/v1/users", userRoutes);

// Catch-all handler for any routes not matched above
// Responds with a 404 Not Found and standard message
app.use((req, res) => {
  return formatResponse(res, 404, STANDARD_MESSAGES['NOT_FOUND']);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}\n url: http://localhost:${PORT}`);
});
