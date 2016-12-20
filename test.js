/**
 * Created by XD on 2016-12-19.
 */
'use strict';
var result,oldData,newData,tt;
function objSameValue(a, b) {
    var aProps = Object.getOwnPropertyNames(a),
        bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

/*
 * check specific key
 */
function equalPropVal(a, b, propName) {
    if (a[propName] === b[propName]) {
        return true;
    }
    return false;
}

/*
 * split search
 */
function splitSearch(array,low,high,target) {
    while ((high-low) > -1) {
        var mid = Math.ceil((low + high) / 2);
        if (target.email.localeCompare(array[mid].email)>0) {
            return splitSearch(array, mid+1, high, target);
        } else if(target.email.localeCompare(array[mid].email)<0){
            return splitSearch(array, low, mid-1, target);
        }
        else {
            return mid;
        }
    }
    return -1;
}

/*
 * main function for comparing arrays
 */
function compare(oldData, newData) {
    var result = { 'added': [], 'deleted': [], 'modified': [] },
    //make a copy of data
        od = oldData.slice(), nd = newData.slice();

    //sort old data by email
    od.sort(function (a, b) {
        return a.email.localeCompare(b.email);
    });

    //loop through new data
    nd.forEach(function (data) {
        var exist = false,
            index = splitSearch(od, 0, od.length-1, data);
        if (index > -1) {
            //check modified
            if (!objSameValue(data, od[index])) {
                result.modified.push({ 'oldData': od[index], 'newData': data });
            }
            od.splice(index, 1);
            exist = true;
        }
        //check added
        if (!exist) {
            result.added.push(data);
        }
    });
    //the rest of od is deleted
    result.deleted = od;
    return result;
}





function generateData(num){
    var ret=[];
    for(var i=0;i<num;i++){
        ret.push({
            'firstName':'firstName'+i,
            'lastName':'lastName'+i,
            'ext':'ext'+i,
            'cell':'cell'+i,
            'alt':'alt'+i,
            'title':'title'+i,
            'email':'email'+i,
        });
    }
    return ret;
}

oldData = generateData(10000);
newData = generateData(10000);
newData.splice(0,1);
newData.splice(4,1,{
    'firstName':'firstName'+'A',
    'lastName':'lastName'+'A',
    'ext':'ext'+'A',
    'cell':'cell'+'A',
    'alt':'alt'+'A',
    'title':'title'+'A',
    'email':'email'+'A',
});

newData[2].title='new title';

tt = newData[3].title;
delete newData[3].title;
newData[3].title=tt;
console.log(oldData);
console.log(newData);
//let compare = require('./function_compare.js');

console.time('a');
 result = compare(oldData,newData);
console.timeEnd('a');

console.log(result);
