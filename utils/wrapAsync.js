// Wraps async route handlers to catch errors and pass them to Express error middleware
module.exports = (fn) => {
    return (req, res, next) => {
        // If fn throws an error, it's caught and passed to next()
        fn(req, res, next).catch(next);
    };
};
