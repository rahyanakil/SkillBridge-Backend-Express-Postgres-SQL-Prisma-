import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const config = {
  port: process.env.PORT || "5000",

  database_url: requiredEnv("DATABASE_URL"),

  jwt: {
    secret: requiredEnv("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "2d",
  },
};

export default config;

// import dotenv from "dotenv";
// import path from "path";

// // Load environment variables
// dotenv.config({ path: path.join(process.cwd(), ".env") });

// interface JWTConfig {
//   secret: string;
//   expiresIn: string;
// }

// interface Config {
//   port: string;
//   database_url: string;
//   jwt: JWTConfig;
// }

// const config: Config = {
//   port: process.env.PORT || "5000",
//   database_url: process.env.DATABASE_URL || "",
//   jwt: {
//     secret: process.env.JWT_SECRET as string,
//     expiresIn: process.env.JWT_EXPIRES_IN || "2d",
//   },
// };

// export default config;
// export { config };
