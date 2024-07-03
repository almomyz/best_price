// models/Product.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/mySqlDB.js';
import Category from './Category.js';
import Brand from './Brand.js';
//import ProductPhotos from './ProductPhotos.js';
const Product = sequelize.define('Product', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Description: {
        type: DataTypes.JSON,  // Change the data type to JSON
        allowNull: true
    },
    Url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

}, {
    timestamps: true
});
Product.belongsTo(Category, { foreignKey: 'Category_ID' });
Product.belongsTo(Brand, { foreignKey: 'Brand_ID' });

export default Product;
