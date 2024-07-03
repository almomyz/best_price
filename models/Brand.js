// models/Brand.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/mySqlDB.js';

const Brand = sequelize.define('Brand', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

export default Brand;
