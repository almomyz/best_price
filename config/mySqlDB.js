// db.js
import { Sequelize } from "sequelize";

// const sequelize = new Sequelize('best_price', 'root', '', {
const sequelize = new Sequelize("best_price", "best_price_user", "&m8x76Ry8", {
    // host: 'localhost',
    host: "nexumind.com",
    port: 3306, // Replace with your MySQL port number
    dialect: "mysql",
    define: { engine: "InnoDB" },
    logging: false,
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

export default sequelize;
