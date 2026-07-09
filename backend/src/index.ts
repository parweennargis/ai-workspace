import dotenv from "dotenv";
import app from "./app";
import { env } from './config';

const PORT = env.PORT;

dotenv.config();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});