// models/Currency.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/mySqlDB.js';

const Currency = sequelize.define('Currency', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Currency;
