var compare = require("./functionCompare.js");
var extract = require("./extractJSON.js");
var fileIO = require("./writeToFile.js");

var compareResult = "./result.txt",
    formerData = "./former.txt";

/**
 * this function will be excuted in requestCallBack function
 * @param {array} result
 */
function afterGetJson(result) {
    var oldData, newData, changes;
    oldData = fileIO.readFromFile(formerData);
    newData = result;
    fileIO.writeToFile(formerData, newData);
    changes = compare.compare(oldData, newData);
    fileIO.writeToFile(compareResult, changes);
}

extract.getJSON(afterGetJson);
