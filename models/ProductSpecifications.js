// models/ProductSpecifications.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/mySqlDB.js';
import Product from './Product.js';

const ProductSpecifications = sequelize.define('ProductSpecifications', {
    Specification_Key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Specification_Value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

ProductSpecifications.belongsTo(Product, { foreignKey: 'Product_ID' });
Product.hasMany(ProductSpecifications, { foreignKey: 'Product_ID' });
export default ProductSpecifications;
