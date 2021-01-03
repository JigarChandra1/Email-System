const db = require('../src/models');
const Sequelize = require('sequelize');

class EmailStatusRequest {
    static add(email, invokedAt) {
        return db.EmailStatusRequest.create({email, last_requested: invokedAt});
    }

    static getRequestCountWithinDuration(email, startTime, endTime) {
        return db.EmailStatusRequest.count({
            where: {
                email: email,
                last_requested: {
                    [Sequelize.Op.between]: [startTime, endTime]
                }
            }
        });
    }
}

module.exports = EmailStatusRequest