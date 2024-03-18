'use strict';

const Sequelize = require('sequelize');
const Rooms = require('./rooms.js');
const Guests = require('./guests.js');

module.exports = function (sequelize, DataTypes) {
    const Bookings = sequelize.define('bookings', {
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
        checkin: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: true,
            validate: {
                isDate: true,
            },
        },
        checkout: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: true,
            validate: {
                isDate: true,
            },
        },
        adults: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            validate: {
                isNumeric: true,
            },
        },
        children: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            validate: {
                isNumeric: true,
            },
        },
        comments: {
            type: Sequelize.TEXT,
            validate: {
                notEmpty: true,
            },
        },
        type: {
            type: Sequelize.ENUM(),
            values: ['online', 'phone', 'agency', 'desk'],
            allowNull: true,
            defaultValue: 'desk',
            validate: {
                isIn: [['online', 'phone', 'agency', 'desk']],
            },
            set(val) {
                if (val) {
                    this.setDataValue('type', val.toLowerCase());
                }
            },
        },
        confirmed: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
        },
        guest_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
            },
            references: {
                model: Guests,
                key: 'id',
            },
        },
        checked_in: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
        },
        checked_out: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
        },
    });

    Bookings.associate = function (models) {
        Bookings.belongsToMany(models.rooms, {
            as: 'room',
            through: 'bookings_has_rooms',
            foreignKey: 'booking_id',
            otherKey: 'room_id',
        });

        Bookings.belongsTo(models.guests, {
            as: 'guest',
            foreignKey: 'guest_id',
        });
    };

    return Bookings;
};
