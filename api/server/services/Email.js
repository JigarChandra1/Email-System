const db = require('../src/models');
const Sequelize = require('sequelize');
const moment = require('moment')

class EmailService {
    static addEmail(email, status) {
        return db.Email.create({email, status});
    }

    static getActiveEmail(email) {
        return db.Email.findOne({
            where: {
                email,
                deleted_at: {
                    [Sequelize.Op.eq]: null
                }
            }
        });
    }

    static getActiveOrDeletedEmail(email) {
        return db.Email.findOne({
            where: {
                email
            }
        });
    }

    static updateEmailStatus(email, status) {
        return db.Email.update({status}, {where: {email}, returning: true}).then(updated => updated[1][0]); // since sequelize returns [affectedRowCount, <ARRAY_OF_UPDATED_INSTANCES>]
    }

    static deleteEmail(email) {
        return db.Email.update({deleted_at: moment()}, {where: {email}});
    }

    static reactivateEmail(email) {
        return db.Email.update({deleted_at: null}, {where: {email}, returning: true}).then(updated => updated[1][0]); // since sequelize returns [affectedRowCount, <ARRAY_OF_UPDATED_INSTANCES>]
    }
}

module.exports = EmailService