/**
 * Created by XD on 2016-12-19.
 */
'use strict';
var result, oldData, newData, tt;

/*
 * Check if two objects' value are equal
 */
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
 * Clone object
 */
function cloneObj(obj) {
    var result = {}, props = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < props.length; i++) {
        var propName = props[i];
        result[propName] = obj[propName];
    }
    return result;
}

/*
 * Quick sort
 */
function objQuickSort(array,key) {
    function swap(arr, a, b) {
        var temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
    function partition(array,low,high,key) {
        var  temp = array[high], storedIndex =low;
        for (var i = low; i < high; i++){
            if (array[low][key].localeCompare(temp[key]) < 0) {
                swap(array, storedIndex, i);
                storedIndex++;
            }
        }
        swap(array, storedIndex, i);
        return storedIndex;
    }
    
    function sort(array, low, high, key) {
        if (low > high) return;
        var pivotIndex = partition(array, low, high, key);
        sort(array, low, pivotIndex - 1,key);
        sort(array, pivotIndex + 1,high,key);
    }
    sort(array,0,array.length-1,key);

    return array;
};


/*
 * split search
 */
function splitSearch(array, low, high, target,key) {
    while ((high - low) > -1) {
        var mid = Math.ceil((low + high) / 2);
        if (target[key].localeCompare(array[mid][key]) > 0) {
            return splitSearch(array, mid + 1, high, target,key);
        } else if (target[key].localeCompare(array[mid][key]) < 0) {
            return splitSearch(array, low, mid - 1, target,key);
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
        beforeSort = oldData.slice(), nd = newData.slice(),od;
    //console.log(nd);
    //sort old data by email
    //od.sort(function (a, b) {
    //    return a.email.localeCompare(b.email);
    //});
    od = objQuickSort(beforeSort,'email');
    //console.log(od);
    //loop through new data
    nd.forEach(function (data) {
        var exist = false,
            index = splitSearch(od, 0, od.length - 1, data,'email');
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





function generateData(num) {
    var ret = [];
    for (var i = num; i > 0; i--) {
        ret.push({
            'firstName': 'firstName' + i,
            'lastName': 'lastName' + i,
            'ext': 'ext' + i,
            'cell': 'cell' + i,
            'alt': 'alt' + i,
            'title': 'title' + i,
            'email': 'email' + i,
        });
    }
    return ret;
}

oldData = generateData(1000);
newData = generateData(1000);
newData.splice(0, 1);
newData.splice(4, 1, {
    'firstName': 'firstName' + 'A',
    'lastName': 'lastName' + 'A',
    'ext': 'ext' + 'A',
    'cell': 'cell' + 'A',
    'alt': 'alt' + 'A',
    'title': 'title' + 'A',
    'email': 'email' + 'A',
});

newData[2].title = 'new title';

tt = newData[3].title;
delete newData[3].title;
newData[3].title = tt;
//let compare = require('./function_compare.js');


console.time('a');
result = compare(oldData, newData);

console.timeEnd('a');

console.log(result);
