const router = require('express').Router();
const emailService = require('../services/Email');
const emailStatusRequest = require('../services/EmailStatusRequest');
const error = require('../errors/error');
const moment = require('moment');
const logger = require('../logger');

const MAX_STATUS_REQUESTS_PER_HOUR = 10

const isValidEmail = (email) => {
    return Boolean(email.trim().match(/[\w-.]+@([\w-]+\.)+[\w-]+/))
}

const isDisposable = (email) => {
    return Boolean(email.trim().match(/[\w-.]\+[\w-.]+@([\w-]+\.)+[\w-]+/))
}

router.post('/', (req, res, next) => {
    if (!req.body || !req.body.email) {
        next(new error.ValidationError('Missing email'));
        return;
    }

    const email = req.body.email;
    if (typeof email !== 'string' || !isValidEmail(email)) {
        next(new error.ValidationError('Invalid email'));
        return;
    }

    const status = isDisposable(email) ? 'RISKY': 'ALLOWED';
    return emailService.getActiveOrDeletedEmail(email).then(record => {
        if (record) {
            if (!record.deleted_at) {
                throw new error.ValidationError('Email already exists');
            }
            return emailService.reactivateEmail(email);
        } else {
            return emailService.addEmail(email, status);
        }
    }).then(emailRecord => res.status(201).json(emailRecord)).catch(err => {
        next(err)});
});

const handleRateLimit = (email, invokedAt) => {
    let exceededLimit = false;
    return emailStatusRequest.add(email, invokedAt).then(() => {
        return emailStatusRequest.getRequestCountWithinDuration(email, 
            moment(invokedAt).startOf('hour'),
            moment(invokedAt).startOf('hour').add(1, 'hour'))
    }).then(requestCount => {
        if (requestCount > MAX_STATUS_REQUESTS_PER_HOUR) {
            logger.warn(`Marking ${email} as risky`);
            return emailService.updateEmailStatus(email, 'RISKY');
        }
    }).catch(err => {
        logger.error('Rate limiting handling failed due to error: ' + err.stack.toString());
    }).finally(() => {
        return exceededLimit;
    });
}

router.get('/:email_id/status', (req, res, next) => {
    const email = req.params.email_id, invokedAt = moment().format();
    let currStatus;
    return emailService.getActiveEmail(email).then(record => {
            if (!record) {
                throw new error.RecordNotFoundError('Could not find requested email');
            }
            currStatus = record.status;
        }).then(() => {
            return handleRateLimit(email, invokedAt);
        }).then( exceededLimit => {
            const status = exceededLimit ? 'RISKY': currStatus;
            res.json({status});
        })
        .catch(err => next(err));
});

router.patch('/:email_id/status/:status(RISKY|ALLOWED)', (req, res, next) => {
    const email = req.params.email_id, status = req.params.status;
    return emailService.getActiveEmail(email).then(record => {
            if (!record) {
                throw new error.RecordNotFoundError('Could not find requested email');
            }
            return emailService.updateEmailStatus(email, status);
        }).then( updatedEmail => {
            res.json(updatedEmail);
        })
        .catch(err => next(err));
});

router.delete('/:email_id', (req, res, next) => {
    const email = req.params.email_id;
    return emailService.getActiveEmail(email).then(record => {
            if (!record) {
                throw new error.RecordNotFoundError('Could not find requested email');
            }
        }).then(() => {
            return emailService.deleteEmail(email);
        }).then( () => {
            res.sendStatus(204);
        })
        .catch(err => next(err));
});

module.exports = router;