const fs = require("fs");
const {logger} = require("#src/middlewares/logger");

const index = (req, res) => {
    // wait 2 seconds before responding

    setTimeout(
        () => {
            return res.json({
                message: 'Welcome to the v1 API',
                success: true,
            });
        },
        2000
    )

};

const devModeStaticApi = (req, res, next) => {
    const currentPath = req.url;
    const jsonFileName = currentPath.replace('/', '').replace('?', '_').replaceAll('&', '_') + '.json';
    if (!jsonFileName) next();
    const jsonFile = global.__appDir + '/data/' + jsonFileName;
    logger.info(`checking for ${jsonFile}...`);
    if (fs.existsSync(jsonFile)) {
        const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        logger.info(`returning data from ${jsonFile}`);
        // res.status(200);
        // res.setHeader('Content-Type', 'application/json');
        return res.json(data);

    }
    next();
};

module.exports = {
    index,
    devModeStaticApi,
};