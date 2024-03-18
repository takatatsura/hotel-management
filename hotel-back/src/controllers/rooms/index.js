'use strict';

const Sequelize = require('sequelize');
const moment = require('moment');
const models = require('../../models');
const routes = [];

// Get Room List
routes.push({
    meta: {
        name: 'roomList',
        method: 'GET',
        paths: ['/room'],
    },
    middleware: (req, res, next) => {
        models.rooms
            .findAll({
                order: [['id', 'DESC']],
                attributes: [
                    ['id', 'uid'],
                    'created_at',
                    'price_night',
                    'type',
                    'name',
                    'max_guests',
                    'available',
                ],
            })
            .then((data) => {
                res.json(data);
                return next();
            })
            .catch((err) => {
                res.status(400);
                if (err.name === 'SequelizeValidationError') {
                    res.json({
                        errors: err.errors,
                        name: err.name,
                    });
                } else {
                    res.json(err);
                }

                return next();
            });
    },
});

// Get single room
routes.push({
    meta: {
        name: 'roomRead',
        method: 'GET',
        paths: ['/room/:id'],
    },
    middleware: (req, res, next) => {
        models.rooms
            .findOne({
                where: {
                    id: {
                        [Sequelize.Op.eq]: req.params.id,
                    },
                },
                attributes: [
                    ['id', 'uid'],
                    'created_at',
                    'price_night',
                    'type',
                    'name',
                    'max_guests',
                    'available',
                ],
                limit: 1,
            })
            .then((data) => {
                res.json(data);
                return next();
            })
            .catch((err) => {
                res.status(400);
                if (err.name === 'SequelizeValidationError') {
                    res.json({
                        errors: err.errors,
                        name: err.name,
                    });
                } else {
                    res.json(err);
                }

                return next();
            });
    },
});

// Create room
routes.push({
    meta: {
        name: 'roomCreate',
        method: 'POST',
        paths: ['/room'],
    },
    middleware: (req, res, next) => {
        // Object to Create
        const form = {
            price_night: req.body.price_night,
            type: req.body.type,
            name: req.body.name,
            max_guests: req.body.max_guests ? req.body.max_guests : null,
            available: req.body.available,
        };

        // create record
        models.rooms
            .create(form)
            .then((data) => {
                res.json(data);
                return next();
            })
            .catch((err) => {
                res.status(400);
                if (err.name === 'SequelizeValidationError') {
                    res.json({
                        errors: err.errors,
                        name: err.name,
                    });
                } else {
                    res.json({
                        errors: [
                            {
                                message: err.message,
                            },
                        ],
                    });
                }

                return next();
            });
    },
});

// Update Room
routes.push({
    meta: {
        name: 'roomUpdate',
        method: 'PUT',
        paths: ['/room/:id'],
    },
    middleware: (req, res, next) => {
        const id = req.params.id;
        // Object to update
        const form = {
            price_night: req.body.price_night,
            type: req.body.type,
            name: req.body.name,
            max_guests: req.body.max_guests ? req.body.max_guests : null,
            available: req.body.available,
        };

        // update record
        models.rooms
            .findOne({
                where: {
                    id: {
                        [Sequelize.Op.eq]: req.params.id,
                    },
                },
            })
            .then((data) => {
                return data.update(form);
            })
            .then((data) => {
                res.json(data);
                return next();
            })
            .catch((err) => {
                res.status(400);
                if (err.name === 'SequelizeValidationError') {
                    res.json({
                        errors: err.errors,
                        name: err.name,
                    });
                } else {
                    res.json({
                        errors: [
                            {
                                message: err.message,
                            },
                        ],
                    });
                }

                return next();
            });
    },
});

// Get Room Status
routes.push({
    meta: {
        name: 'roomStatuses',
        method: 'GET',
        paths: ['/room-status/:id'],
    },
    middleware: (req, res, next) => {
        models.room_status
            .findAll({
                where: {
                    room_id: {
                        [Sequelize.Op.eq]: req.params.id,
                    },
                    created_at: {
                        // Select from the last 7 days
                        [Sequelize.Op.gte]: moment()
                            .subtract(7, 'days')
                            .toDate(),
                    },
                },
                attributes: [
                    ['id', 'uid'],
                    'created_at',
                    'old_status',
                    'new_status',
                    'room_id',
                ],
            })
            .then((data) => {
                res.json(data);
                return next();
            })
            .catch((err) => {
                res.status(400);
                if (err.name === 'SequelizeValidationError') {
                    res.json({
                        errors: err.errors,
                        name: err.name,
                    });
                } else {
                    res.json(err);
                }

                return next();
            });
    },
});

module.exports = routes;
