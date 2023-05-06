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
    );

};

const devModeStaticApi = (req, res, next) => {
        const currentPath = req.url;
        const jsonFileName = currentPath.replace('/', '').replace('?', '_').replaceAll('&', '_') + '.json';
        if (!jsonFileName) next();
        const jsonFile = global.__appDir + '/data/' + jsonFileName;
        logger.info(`checking for ${jsonFile}...`);
        if (fs.existsSync(jsonFile)) {
            // check the age of the file
            const stats = fs.statSync(jsonFile);
            const mtime = new Date(stats.mtime);
            const now = new Date();
            const diff = now - mtime;
            const diffInMinutes = Math.round(diff / 60000);
            logger.info(`file age: ${diffInMinutes} minutes`);
            if (diffInMinutes <= 12 * 60) {
                const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
                logger.info(`returning data from ${jsonFile}`);
                // res.status(200);
                // res.setHeader('Content-Type', 'application/json');
                return res.json(data);
            }
            logger.info(`file age is greater than 12 hours, skipping ${jsonFile}`);
            // fs.unlinkSync(jsonFile);
        }
        next();
    }
;

module.exports = {
    index,
    devModeStaticApi,
};