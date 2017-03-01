const cheerio = require('cheerio'),
    fs = require('fs'),
    iconv =require('iconv-lite'),
    openurl = require('openurl'),
    request = require('request');

const BASE_DIR = 'C:\\Users\\Ttong\\Desktop\\ProjectH\\',
    RESULTDIR = 'json\\',
    HOUSE = 'house_',
    RUNNING_TIME = new Date().toLocaleString().replace(/ /g, '').replace(/\//g, '_').replace(/,/g, '__').replace(/:/g, '_'),
    //.replace(/:(?:\d{2}) ([AP]M)/, '$1')
    RESULT_FILE = BASE_DIR + RESULTDIR + HOUSE + RUNNING_TIME + '.txt';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
};

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
    console.log('requesting url');
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: url,
            encoding:null,
            headers: headers
        }, (err, response, body) => {
            if (err || response.statusCode !== 200) reject(err)
            else resolve(body);
        });
    });
};

let getDom = body => {
    console.log('getting dom');
    return new Promise((resolve, reject) => {
        try {
            let html = iconv.decode(body, 'gb2312');
            let window = cheerio.load(html, { decodeEntities: false });
            resolve(window);
        } catch (err) {
            reject(err);
        } 
    });
};

let getData = {
    '_51caHouseSelling': window => {
        return new Promise((resolve, reject) => {
            let $ = window;
            try {
                $('.HouseListBit').each((i, element) => {
                    var name = $(element).find('.HouseAgent').text(),
                        location = $(element).find('.MainSection').text(),
                        price = $(element).find('.HousePrice').text(),
                        tel = $(element).find('.Phone').html(),
                        email = $(element).find('.Email').children('a').attr('href'),
                        type = $(element).find('.HouseType').text(),
                        imgLink = $(element).find('.HousePhoto').find('img').attr('src');

                    info['_51caHouseSelling'].push({
                        name: name,
                        location: location,
                        price: price,
                        tel: tel,
                        email: email,
                        type: type,
                        imgLink: imgLink,
                    });
                    resolve(info['_51caHouseSelling']);
                });
            } catch (err) {
                reject(e);
            }           
        });
       
        //'HouseListBit';
    },
    'yorkbbsHouseSelling': window => {
        let $ = window;

    },
};

let processResult = (array) => {
    let path = RESULT_FILE;

    fs.open(path, 'a', storeIntoFile(path, array));
};

let storeIntoFile = (path, array) => {
    return function () {
        fs.writeFile(path, JSON.stringify(array));
    };
};


let run = () => {
    requestUrl(urlList['_51caHouseSelling']).then(getDom, logError).then(getData['_51caHouseSelling'], logError).then(processResult);
};

run();
