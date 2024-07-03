// models/ProductPhotos.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/mySqlDB.js';
import Product from './Product.js';

const ProductPhotos = sequelize.define('ProductPhotos', {
    Photo_URL: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

ProductPhotos.belongsTo(Product, { foreignKey: 'Product_ID' });
Product.hasMany(ProductPhotos, { foreignKey: 'Product_ID' });

export default ProductPhotos;
