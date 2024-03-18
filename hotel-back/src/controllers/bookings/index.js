'use strict';

const moment = require('moment');
const Sequelize = require('sequelize');
const Promise = require('bluebird');
const models = require('../../models');
const routes = [];

routes.push({
    meta: {
        name: 'bookingList',
        method: 'GET',
        paths: ['/booking'],
    },
    middleware: (req, res, next) => {
        const tokenData = req.user;

        // find records
        models.bookings
            .findAll({
                order: [['id', 'DESC']],
                include: [
                    {
                        model: models.rooms,
                        as: 'room',
                        required: true,
                    },
                    {
                        model: models.guests,
                        as: 'guest',
                        required: true,
                    },
                ],
            })
            .then((data) => {
                const resObj = data.map((booking) => {
                    // tidy up the user data
                    return Object.assign(
                        {},
                        {
                            uid: booking.id,
                            created_at: booking.created_at,
                            checkin: booking.checkin,
                            checkout: booking.checkout,
                            amount: booking.amount,
                            type: booking.type,
                            confirmed: booking.confirmed,
                            room: booking.room.map((item) => {
                                return Object.assign(
                                    {},
                                    {
                                        uid: item.id,
                                        name: item.name,
                                        type: item.type,
                                    }
                                );
                            }),
                            guest: Object.assign(
                                {},
                                {
                                    uid: booking.guest.id,
                                    first_name: booking.guest.first_name,
                                    last_name: booking.guest.last_name,
                                    mobile: booking.guest.mobile,
                                    email: booking.guest.email,
                                }
                            ),
                            checked_in: booking.checked_in,
                            checked_out: booking.checked_out,
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
        name: 'bookingRead',
        method: 'GET',
        paths: ['/booking/:id'],
    },
    middleware: (req, res, next) => {
        // find specific record
        models.bookings
            .findOne({
                where: {
                    id: {
                        [Sequelize.Op.eq]: req.params.id,
                    },
                },
                include: [
                    {
                        model: models.rooms,
                        as: 'room',
                        required: true,
                    },
                    {
                        model: models.guests,
                        as: 'guest',
                        required: true,
                    },
                ],
                limit: 1,
            })
            .then((booking) => {
                const resObj = Object.assign(
                    {},
                    {
                        uid: booking.id,
                        created_at: booking.created_at,
                        checkin: booking.checkin,
                        checkout: booking.checkout,
                        amount: booking.amount,
                        breakfast: booking.breakfast,
                        nights: booking.nights,
                        adults: booking.adults,
                        children: booking.children,
                        comments: booking.comments,
                        type: booking.type,
                        confirmed: booking.confirmed,
                        room: booking.room.map((item) => {
                            return Object.assign(
                                {},
                                {
                                    uid: item.id,
                                    name: item.name,
                                    max_guests: item.max_guests,
                                    price_night: item.price_night,
                                    type: item.type,
                                }
                            );
                        }),
                        guest: Object.assign(
                            {},
                            {
                                uid: booking.guest.id,
                                first_name: booking.guest.first_name,
                                last_name: booking.guest.last_name,
                                mobile: booking.guest.mobile,
                                email: booking.guest.email,
                            }
                        ),
                        checked_in: booking.checked_in,
                        checked_out: booking.checked_out,
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
        name: 'bookingCreate',
        method: 'POST',
        paths: ['/booking'],
    },
    middleware: (req, res, next) => {
        // object
        const form = {
            checkin: new Date(req.body.checkin),
            checkout: new Date(req.body.checkout),
            adults: req.body.adults,
            children: req.body.children,
            comments: req.body.comments ? req.body.comments : null,
            rooms: req.body.rooms ? req.body.rooms : null,
            guest_id: req.body.guest_id ? req.body.guest_id : null,
        };

        const nights = moment(form.checkout).diff(form.checkin, 'days', true);
        form.nights = Math.round(nights);

        if (form.nights > 0) {
            models.rooms
                .findAll({
                    where: {
                        id: {
                            [Sequelize.Op.in]: form.rooms,
                        },
                    },
                    attributes: ['price_night'],
                })
                .then((data) => {
                    if (data.length > 0) {
                        const amount = data.reduce((sum, item) => {
                            return (
                                parseFloat(sum.dataValues.price_night) +
                                parseFloat(item.dataValues.price_night)
                            );
                        });
                        form.amount = form.nights * amount;

                        // open transaction
                        return models.sequelize
                            .transaction((t) => {
                                // create booking
                                return models.bookings
                                    .create(form)
                                    .then((data) => {
                                        // map rooms and create one by one
                                        return Promise.map(
                                            form.rooms,
                                            (room) => {
                                                return models.sequelize.query(
                                                    'INSERT INTO bookings_has_rooms (booking_id, room_id) VALUES (:booking_id, :room_id)',
                                                    {
                                                        transaction: t,
                                                        replacements: {
                                                            booking_id: data.id,
                                                            room_id: room,
                                                        },
                                                        type: Sequelize
                                                            .QueryTypes.INSERT,
                                                    }
                                                );
                                            }
                                        ).then(() => {
                                            return data;
                                        });
                                    });
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
                    } else {
                        throw Error('Select at least one room');
                    }
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
        } else {
            res.status(400);
            res.json({
                errors: [
                    {
                        message: 'Dates given are not valid',
                    },
                ],
            });

            return next();
        }
    },
});

routes.push({
    meta: {
        name: 'bookingUpdate',
        method: 'PUT',
        paths: ['/booking/:id'],
    },
    middleware: (req, res, next) => {
        const id = req.params.id;

        // object
        const form = {
            checkin: new Date(req.body.checkin),
            checkout: new Date(req.body.checkout),
            adults: req.body.adults,
            children: req.body.children,
            comments: req.body.comments ? req.body.comments : null,
            rooms: req.body.rooms ? req.body.rooms : null,
            guest_id: req.body.guest_id ? req.body.guest_id : null,
            confirmed: req.body.confirmed,
        };

        const nights = moment(form.checkout).diff(form.checkin, 'days', true);
        form.nights = Math.round(nights);

        if (form.nights > 0) {
            models.rooms
                .findAll({
                    where: {
                        id: {
                            [Sequelize.Op.in]: form.rooms,
                        },
                    },
                    attributes: ['price_night'],
                })
                .then((data) => {
                    if (data.length > 0) {
                        const amount = data.reduce((sum, item) => {
                            return (
                                parseFloat(sum) +
                                parseFloat(item.dataValues.price_night)
                            );
                        }, 0);
                        form.amount = form.nights * amount;

                        // open transaction
                        return models.sequelize
                            .transaction((t) => {
                                // find record and update it
                                return models.bookings
                                    .findOne({
                                        where: {
                                            id: {
                                                [Sequelize.Op.eq]:
                                                    req.params.id,
                                            },
                                        },
                                    })
                                    .then((data) => {
                                        // update record
                                        return data
                                            .update(form)
                                            .then((updated) => {
                                                return models.sequelize
                                                    .query(
                                                        'DELETE FROM bookings_has_rooms WHERE booking_id = :booking_id',
                                                        {
                                                            transaction: t,
                                                            replacements: {
                                                                booking_id:
                                                                    updated.id,
                                                            },
                                                            type: Sequelize
                                                                .QueryTypes
                                                                .DELETE,
                                                        }
                                                    )
                                                    .then(() => {
                                                        // map rooms and create one by one
                                                        return Promise.map(
                                                            form.rooms,
                                                            (room) => {
                                                                return models.sequelize.query(
                                                                    'INSERT INTO bookings_has_rooms (booking_id, room_id) VALUES (:booking_id, :room_id)',
                                                                    {
                                                                        transaction:
                                                                            t,
                                                                        replacements:
                                                                            {
                                                                                booking_id:
                                                                                    data.id,
                                                                                room_id:
                                                                                    room,
                                                                            },
                                                                        type: Sequelize
                                                                            .QueryTypes
                                                                            .INSERT,
                                                                    }
                                                                );
                                                            }
                                                        ).then(() => {
                                                            return updated;
                                                        });
                                                    });
                                            });
                                    });
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
                    } else {
                        throw Error('Select at least one room');
                    }
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
        } else {
            res.status(400);
            res.json({
                errors: [
                    {
                        message: 'Dates given are not valid',
                    },
                ],
            });

            return next();
        }

        // update record
        models.bookings
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
                    res.json(err);
                }

                return next();
            });
    },
});

routes.push({
    meta: {
        name: 'bookingCheckIn',
        method: 'PUT',
        paths: ['/booking-check-in/:id'],
    },
    middleware: (req, res, next) => {
        const id = req.params.id;

        // object
        const form = {
            checkedIn: req.body.checkedIn,
        };

        models.bookings
            .findOne({
                where: {
                    id: {
                        [Sequelize.Op.eq]: req.params.id,
                    },
                },
            })
            .then((data) => {
                if (data.checked_in) {
                    throw 'AlreadyCheckedIn';
                }
                return data.update({ checked_in: form.checkedIn });
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

routes.push({
    meta: {
        name: 'bookingCheckOut',
        method: 'PUT',
        paths: ['/booking-check-out/:id'],
    },
    middleware: (req, res, next) => {
        const id = req.params.id;

        // object
        const form = {
            checkedOut: req.body.checkedOut,
        };

        models.bookings
            .findOne({
                where: {
                    id: {
                        [Sequelize.Op.eq]: req.params.id,
                    },
                },
            })
            .then((data) => {
                if (!data.checked_in) {
                    throw 'NotCheckedIn';
                } else if (data.checked_out) {
                    throw 'AlreadyCheckedOut';
                }
                return data.update({ checked_out: form.checkedOut });
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
