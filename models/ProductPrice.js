// models/ProductPrice.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/mySqlDB.js';
import Product from './Product.js';
import Currency from './Currency.js';
import Store from './Store.js';

const ProductPrice = sequelize.define('ProductPrice', {
    Price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    WasPrice: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Discount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
}, {
    timestamps: true
});

ProductPrice.belongsTo(Product, { foreignKey: 'Product_ID' });
ProductPrice.belongsTo(Currency, { foreignKey: 'Currency_ID' });
ProductPrice.belongsTo(Store, { foreignKey: 'Store_ID' });
Product.hasMany(ProductPrice, { foreignKey: 'Product_ID' });
export default ProductPrice;
