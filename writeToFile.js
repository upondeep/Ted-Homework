var fs = require("fs");

/**
 * @param {string} path
 * @param {object} object
 */
exports.writeToFile = function (path,object) {   
    fs.writeFileSync(path, JSON.stringify(object), 'utf8');
    console.log('Saved!');
};

/**
 * @param {string} path
 */
exports.readFromFile = function (path) {
    var result = [];
    if (fs.existsSync(path)) {
        result = [].slice.call(JSON.parse(fs.readFileSync(path, 'utf8')));
    };
    console.log('read from ' + path);
    return result;
}
