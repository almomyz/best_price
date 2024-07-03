// models/Store.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/mySqlDB.js';

const Store = sequelize.define('Store', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Logo: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

export default Store;
