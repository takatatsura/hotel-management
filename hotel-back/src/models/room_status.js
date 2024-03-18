'use strict';

const Sequelize = require('sequelize');
const Rooms = require('./rooms.js');

module.exports = function (sequelize, DataTypes) {
    const RoomStatus = sequelize.define('room_status', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        old_status: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1,
            get() {
                const old_status = this.getDataValue('old_status');
                return old_status ? true : false;
            },
        },
        new_status: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1,
            get() {
                const new_status = this.getDataValue('new_status');
                return new_status ? true : false;
            },
        },
        room_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
            },
            references: {
                model: Rooms,
                key: 'id',
            },
        },
    });

    RoomStatus.associate = function (models) {
        RoomStatus.belongsTo(models.rooms, {
            as: 'room',
            foreignKey: 'room_id',
        });
    };

    return RoomStatus;
};
