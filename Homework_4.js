const cheerio = require('cheerio'),
    fs = require('fs'),
    http = require('http'),
    openurl = require('openurl'),
    request = require('request');

const BASE_DIR = 'C:\Users\Ttong\Desktop\ProjectH',
    RUNNING_TIME = new Date().toJSON(),
    RESULT_FILE = BASE_DIR + HOUSE + RUNNING_TIME + '.json';

const urlList = {
    _51caHouseSelling: 'http://www.51.ca/house/housedisplay.php?s=7171bc76c6ff39eb8038d5e5ae2bf871',
    yorkbbsHouseSelling: 'http://house.yorkbbs.ca/selling/list.aspx'
};

var info = {
    '_51caHouseSelling': [],
    'yorkbbsHouseSelling': []
};

//var $;

/*
 * reject handler
 */
let logError = err => {
    console.log(err);
};

let requestUrl = url => {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: url
        }, (err, response, html) => {
            if (err || response.statusCode !== 200) reject(err)
            else resolve(html);
        });
    });
};

let getDom = body => {
    return new Promise((resolve, reject) => {
        let window = cheerio.load(body);
        resolve(window);
    });
};

let getData = {
    '_51caHouseSelling': window => {
        let $ = window;
        $('.HouseListBit').each((i, element) => {
            var name = '',
                location = '',
                price = '',
                tel = '',
                email = '',
                type = '',
                imgLink = '';

            info['_51caHouseSelling'].push({
                name: name,
                location: location,
                price: price,
                tel: tel,
                email: email,
                type: type,
                imgLink: imgLink,
            });
        });


        //'HouseListBit';
    },
    'yorkbbsHouseSelling': window => {
        let $ = window;

    },
}; 




