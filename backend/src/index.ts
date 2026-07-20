import dotenv, { config } from "dotenv";
import app from "./app";
import { env } from './config';
import { connectDatabase } from "./config/database";
import { logger } from "./utils/logger";

const PORT = env.PORT;

dotenv.config();

const bootstrap = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

bootstrap();