/**
 * @param {array} a
 * @param {array} b
 */
exports.compare = function (a, b) {
    var result, oldData, newData, tt;
    var key = 'E-mail Address';

    function objSameValue(a, b) {
        var aProps = Object.getOwnPropertyNames(a),
            bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        };

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            if (a[propName] !== b[propName]) {
                return false;
            };
        };

        return true;
    }

    /**
     * @param {array} array
     * @param {string} key
     */
    function objQuickSort(array, key) {

        /**
         * @param {array} arr
         * @param {number} a
         * @param {number} b 
         */
        function swap(arr, a, b) {
            var temp = arr[a];

            arr[a] = arr[b];
            arr[b] = temp;
        }

        /**
         * @param {array} array
         * @param {number} low
         * @param {number} high
         * @param {string} key
         */
        function partition(array, low, high, key) {
            var pivot = array[high], storedIndex = low;

            for (var i = low; i < high; i++) {
                if (array[i][key].localeCompare(pivot[key]) < 0) {
                    swap(array, storedIndex, i);
                    storedIndex++;
                };
            };

            swap(array, storedIndex, i);

            return storedIndex;
        }

        /**
         * @param {array} array
         * @param {number} low
         * @param {number} high
         * @param {string} key
         */
        function sort(array, low, high, key) {
            if (low > high) return;
            var pivotIndex = partition(array, low, high, key);

            sort(array, low, pivotIndex - 1, key);
            sort(array, pivotIndex + 1, high, key);
        }

        sort(array, 0, array.length - 1, key);

        return array;
    };

    /**
     * split search
     * @param {array} array
     * @param {number} low
     * @param {number} high
     * @param {object} target
     * @param {string} key
     */
    function splitSearch(array, low, high, target, key) {
        while ((high - low) > -1) {
            var mid = Math.ceil((low + high) / 2);

            if (target[key].localeCompare(array[mid][key]) > 0) {
                return splitSearch(array, mid + 1, high, target, key);
            } else if (target[key].localeCompare(array[mid][key]) < 0) {
                return splitSearch(array, low, mid - 1, target, key);
            }
            else {
                return mid;
            };
        };

        return -1;
    }

    /**
     * main function for comparing arrays
     * @param {array} oldData
     * @param {array} newData
     */
    function compare(oldData, newData) {
        var result = { 'added': [], 'deleted': [], 'modified': [] },
        //make a copy of data
        beforeSort = oldData.slice(),
        nd = newData.slice(),
        od;

        od = objQuickSort(beforeSort, key);
        nd.forEach(function (data) {
            var exist = false,
                index = splitSearch(od, 0, od.length - 1, data, key);

            if (index > -1) {
                //check modified
                if (!objSameValue(data, od[index])) {
                    result.modified.push({ 'oldData': od[index], 'newData': data });
                };
                od.splice(index, 1);
                exist = true;
            };

            //check added
            if (!exist) {
                result.added.push(data);
            };
        });

        //the rest of od is deleted
        result.deleted = od;

        return result;
    }

    return compare(a, b);
};

//function cloneObj(obj) {
//    var result = {}, props = Object.getOwnPropertyNames(obj);
//    for (var i = 0; i < props.length; i++) {
//        var propName = props[i];
//        result[propName] = obj[propName];
//    }
//    return result;
//}
