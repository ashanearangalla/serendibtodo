import { Sequelize } from "sequelize";

// create sequelize instance
const sequelize = new Sequelize(
  "tododb",      // database name
  "root",        // username
  "",            // password
  {
    host: "localhost",
    dialect: "mysql",
    logging: false, // remove SQL logs in console (optional)
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// function to connect
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database Connected (Sequelize)");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

// ⭐ export sequelize instead of pool
export default sequelize;