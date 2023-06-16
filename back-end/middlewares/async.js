const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(
        (e) => {
            console.log(e.message);
            next(e);
        }
    );

module.exports = asyncHandler;
