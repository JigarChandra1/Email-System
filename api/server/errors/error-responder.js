const errors = require('./error');

const errorClasses = Object.keys(errors);

module.exports = (err, req, res, next) => {
    let status, message;

    if (errorClasses.includes(err.name)) {
        status = err.status;
        message = err.message;
    } else {
        console.log('Unxpected server error: ' + err.message);
        status = 500;
    }
    res.status(status).json({message});
}