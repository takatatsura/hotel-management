'use strict';

const Sequelize = require('sequelize');
const models = require('../../models');
const routes = [];

routes.push({
    meta: {
        name: 'guestList',
        method: 'GET',
        paths: ['/guest'],
    },
    middleware: (req, res, next) => {
        models.guests
            .findAll({
                order: [['id', 'DESC']],
            })
            .then((data) => {
                const resObj = data.map((guest) => {
                    // tidy up the user data
                    return Object.assign(
                        {},
                        {
                            uid: guest.id,
                            created_at: guest.created_at,
                            first_name: guest.first_name,
                            last_name: guest.last_name,
                            phone: guest.phone,
                            mobile: guest.mobile,
                            city: guest.city,
                            country: guest.country,
                            email: guest.email,
                            organization: guest.organization,
                            age: guest.age,
                            gender: guest.gender,
                        }
                    );
                });
                res.json(resObj);
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

routes.push({
    meta: {
        name: 'guestRead',
        method: 'GET',
        paths: ['/guest/:id'],
    },
    middleware: (req, res, next) => {
        models.guests
            .findOne({
                where: {
                    id: {
                        [Sequelize.Op.eq]: req.params.id,
                    },
                },
                limit: 1,
            })
            .then((guest) => {
                const resObj = Object.assign(
                    {},
                    {
                        uid: guest.id,
                        created_at: guest.created_at,
                        first_name: guest.first_name,
                        last_name: guest.last_name,
                        phone: guest.phone,
                        mobile: guest.mobile,
                        city: guest.city,
                        country: guest.country,
                        email: guest.email,
                        organization: guest.organization,
                        age: guest.age,
                        gender: guest.gender,
                    }
                );
                res.json(resObj);
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

routes.push({
    meta: {
        name: 'guestCreate',
        method: 'POST',
        paths: ['/guest'],
    },
    middleware: (req, res, next) => {
        // object
        const form = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone ? req.body.phone : null,
            mobile: req.body.mobile ? req.body.mobile : null,
            city: req.body.city,
            country: req.body.country,
            email: req.body.email ? req.body.email : null,
            organization: req.body.organization ? req.body.organization : null,
            age: req.body.age ? req.body.age : null,
            gender: req.body.gender ? req.body.gender : null,
        };

        // create record
        models.guests
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

routes.push({
    meta: {
        name: 'guestUpdate',
        method: 'PUT',
        paths: ['/guest/:id'],
    },
    middleware: (req, res, next) => {
        const id = req.params.id;
        // object
        const form = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone ? req.body.phone : null,
            mobile: req.body.mobile ? req.body.mobile : null,
            city: req.body.city,
            country: req.body.country,
            email: req.body.email ? req.body.email : null,
            organization: req.body.organization ? req.body.organization : null,
            age: req.body.age ? req.body.age : null,
            gender: req.body.gender ? req.body.gender : null,
        };

        // update record
        models.guests
            .find({
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

module.exports = routes;
