
const { writeFile } = require('fs');

//
function fileNamifyUrl(url) {
 // convert the url to a valid file name by replacing all non-alphanumeric characters with _
    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.replaceAll('/', '_').replaceAll('?', '_').replaceAll('&', '_').replaceAll('=', '_eq_');
}

function saveJsonAndSend(req, res, jsonResult) {

    // save result to file
    const url = req.url;
    // url decode the url
    // const urlDecoded = decodeURIComponent(url);
    // convert url to file name
    const jsonFileName = fileNamifyUrl(url) + '.json';

    const jsonFile = global.__appDir + '/data/' + jsonFileName;
    writeFile(jsonFile, JSON.stringify(jsonResult, null, 2), (err) => {
        if (err) throw err;
    }, () => {
        console.log(`Data written to file ${jsonFile}`);
    });

    res.json(jsonResult);

}
module.exports = {
    saveJsonAndSend,
}