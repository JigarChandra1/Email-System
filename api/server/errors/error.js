const util = require('util');

function RecordNotFoundError(message) {
    Error.call(this);
    this.name = 'RecordNotFoundError';
    this.message = message || 'Could not find the requested record';
    this.status = 404;
}

util.inherits(RecordNotFoundError, Error);

function ValidationError(message) {
    Error.call(this);
    this.name = 'ValidationError';
    this.message = message || 'Invalid parameters specified';
    this.status = 422;
}

util.inherits(ValidationError, Error);

function InternalError(message) {
    Error.call(this);
    this.name = 'InternalError';
    this.message = message || 'An unknown error occurred';
    this.status = 500;
}

util.inherits(InternalError, Error);

module.exports = {
    RecordNotFoundError,
    ValidationError,
    InternalError
}