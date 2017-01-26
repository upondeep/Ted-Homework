var cheerio = require("cheerio"),
    request = require("request");

/**
 * afterGetJson is the handler will get excuted after querying from the website
 * @param {function} afterGetJson
 */
exports.getJSON = function(afterGetJson) {
    var url = "http://web-aaronding.rhcloud.com/employee.html",
        result = [],
        keys = [],
        nd;

    function requestCallBack(err, response, body) {
        if (err) return console.error(err);
        var $ = cheerio.load(body);
        //get keys
        $('tr th').each(function (i, element) {
            keys.push($(this).text());
        });
        //assign td values
        $('tr:not(:first-child)').each(function (i, element) {
            nd = {};

            $(this).children('td').each(function (j, elem) {
                nd[keys[j]] = $(this).text();
            });
            result.push(nd);
        });
        result.shift();

        //this is the function handles result
        afterGetJson(result);
    }

    request({
        method: 'GET',
        url: url
    }, requestCallBack);
}


//var xhr = new XMLHttpRequest();
//xhr.open("GET", url, true);
//xhr.onload = getSourceDOM();
//xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
//xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//xhr.send();

//function getSourceDOM() {
//    var parser = new DOMParser();
//    var result = parser.parseFromString(xhr.responseText, "text/html");
//    console.log(result);
//}

