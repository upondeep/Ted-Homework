const cheerio = require('cheerio'),
    fs = require('fs'),
    iconv =require('iconv-lite'),
    openurl = require('openurl'),
    request = require('request');

const BASE_DIR = 'C:\\Users\\Ttong\\Desktop\\ProjectH\\',
    RESULTDIR = 'json\\',
    IMAGEDIR = 'images\\',
    HOUSE = 'house_',
    RUNNING_TIME = new Date().toLocaleString().replace(/ /g, '').replace(/\//g, '_').replace(/,/g, '__').replace(/:/g, '_'),
    //.replace(/:(?:\d{2}) ([AP]M)/, '$1')
    RESULT_FILE = BASE_DIR + RESULTDIR + HOUSE + RUNNING_TIME + '.txt',
    RESULT_IMAGE = BASE_DIR + IMAGEDIR + RUNNING_TIME + '\\';


const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
};

const urlList = {
    _51caHouseSelling: 'http://www.51.ca/house/housedisplay.php?s=7171bc76c6ff39eb8038d5e5ae2bf871',
    yorkbbsHouseSelling: 'http://house.yorkbbs.ca/selling/list.aspx?infosource=1'
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
                reject(err);
            }           
        });     
        //'HouseListBit';
    },
    'yorkbbsHouseSelling': {
        'getAllList':window => {
            return new Promise((resolve, reject) => {
                try {
                    console.log('getAllList');
                    let $ = window,
                        website = 'http://house.yorkbbs.ca/selling',
                        loop = [],
                        leth =$('#plSellingMessage li h2').length;
                    $('#plSellingMessage li h2').each((i, element) => {
                        var subLink = ('/' + $(element).find('h2 a').attr('href')).replace('//', '/');

                        var step = new Promise((resolve, reject) => {
                            requestUrl(website + subLink)
                            .then(getDom, logError)
                            .then(getData.yorkbbsHouseSelling.processSubLink, logError).then(() => {
                                //console.log('final stage......................');
                                //console.log(info.yorkbbsHouseSelling.length);
                                //console.log(leth);
                                if (info.yorkbbsHouseSelling.length === leth) processResult(info.yorkbbsHouseSelling);
                            },logError);
                                //.then(processResultt);
                        });

                        loop.push(step);
                    });
                    Promise.all(loop);
                } catch (err) {
                    reject(err);
                } 
            });
            //'plSellingBidPrice';
        },
        'processSubLink': window => {
            console.log('processSubLink');
            return new Promise((resolve, reject) => {
                        var name, location, price, tel, email, type, imgLink;
                        console.log('Enter Sublink');
                        let $ = window;
                        $('.views-row-address p').remove();            
                        console.log($('.views-cover-img').find('img').attr('src'));
                        name = $('.views-people em').text();
                        location = $('.views-row-address').text();
                        price = $('.views-price').text();
                        tel = $('.views-phone em').html();
                        email = $('.views-link').children().first().attr('href');
                        type = $('.views-content ul:nth-child(3) span').text();
                        imgLink = $('.views-cover-img').find('img').attr('src') || '';

                        info.yorkbbsHouseSelling.push({
                            name: name,
                            location: location,
                            price: price,
                            tel: tel,
                            email: email,
                            type: type,
                            imgLink: imgLink,
                        });
                        resolve();
            });
        },
    },
};


let processResult = (array) => {

    console.log('Process Result:');
    console.log(array);

    let path = RESULT_FILE;
    let imgPath = RESULT_IMAGE;
    array.forEach((record) => {
        let link = record['imgLink'] ? record['imgLink'].toString() : '';
        let filename = RESULT_IMAGE + link.substring(link.lastIndexOf('/') + 1);
        if(link)
        download(link, filename, () => { });
    });
    fs.open(path, 'a', storeIntoFile(path, array));
};

let download = (uri, filename, callback) => {
    let dir = filename.substring(filename.lastIndexOf('\\'), 0);
    fs.mkdir(dir, () => { });
    request.head(uri, function (err,res,body) {
        request(uri).pipe(fs.createWriteStream(filename, {falgs:'w'})).on('close',callback);
    });
};

let storeIntoFile = (path, array) => {
    return function () {
        fs.writeFile(path, JSON.stringify(array), {flag:'a'});
    };
};
////////////////
let processResultt = (array) => {

    console.log('Process Result:.............................................');
    //console.log(array);
};

let run = () => {
    requestUrl(urlList['_51caHouseSelling'])
        .then(getDom, logError)
        .then(getData['_51caHouseSelling'], logError)
        .then(processResult)
    ;

    requestUrl(urlList['yorkbbsHouseSelling'])
        .then(getDom, logError)
        .then(getData.yorkbbsHouseSelling.getAllList, logError)
        //.then((loop) => {
        //    Promise.all(loop);
            
                //.then(getData.yorkbbsHouseSelling.processSubLink, logError)
                //.then(processResultt, logError).catch(reason => {
                //    console.log(reason)
                //});
            //return new Promise((resolve, reject) => { resolve(Promise.all(loop)); });
        //}, logError)
    
        
        //.then(processResultt)
    ;

};

run();
