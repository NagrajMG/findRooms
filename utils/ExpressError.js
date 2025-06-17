// Custom error class for handling HTTP errors in Express
class ExpressError extends Error {
    constructor(statusCode, message) {
        super(); // Call the base Error constructor
        this.statusCode = statusCode; // HTTP status code 
        this.message = message;       // Error message
    }
}

module.exports = ExpressError; // Export 
