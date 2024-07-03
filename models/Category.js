// models/Category.js
import { DataTypes } from "sequelize";
import sequelize from "../config/mySqlDB.js";

const Category = sequelize.define(
    "Category",
    {
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Parent_Category_ID: {
            type: DataTypes.INTEGER,
            references: {
                model: "Categories", // Name of the table to reference
                key: "id", // Primary key of the referenced table
            },
            allowNull: true, // Allow null for root categories that don't have a parent
        },
    },
    {
        timestamps: true,
        tableName: "Categories", // Explicitly set the table name to match the reference
    }
);

// Define the self-referential association
Category.hasMany(Category, {
    as: "SubcategoriesLevel1",
    foreignKey: "Parent_Category_ID",
});
Category.hasMany(Category, {
    as: "SubcategoriesLevel2",
    foreignKey: "Parent_Category_ID",
});

Category.belongsTo(Category, {
    as: "ParentCategory",
    foreignKey: "Parent_Category_ID",
});

export default Category;
