(function(Tim) {
    Tim.Database = Tim.Database || {};

    Tim.Database.parseObject = function(data, fromData, toData) {
        let database = [];
        Tim.Database._parseObjectRecursive(database, data, fromData, toData);
        return database;
    }

    Tim.Database._parseObjectRecursive = function (database, data, fromData, toData) {
        if (Tim.Utils.checkSameType([data, fromData, toData]) === false)
            throw new Error("data and fromData and toData must be same type");

        if (typeof data === "object") {
            for (let key in data) {
                if (Tim.Utils.checkHaveProperty([data, fromData, toData], key) === false)
                    continue;
                if (Tim.Utils.checkSameType([data[key], fromData[key], toData[key]]) === false)
                    throw new Error("data and fromData and toData must be same type");

                if (typeof data[key] === "number") {
                    let dataGetSet = {getter: () => data[key], setter: (value) => data[key] = value};
                    let fromDataGetSet = {getter: () => fromData[key], setter: (value) => fromData[key] = value};
                    let toDataGetSet = {getter: () => toData[key], setter: (value) => toData[key] = value};
                    database.push({dataGetSet: dataGetSet, fromDataGetSet: fromDataGetSet, toDataGetSet: toDataGetSet});
                } else {
                    Tim.Database._parseObjectRecursive(database, data[key], fromData[key], toData[key]);
                }
            }
        }
    }
})(window.Tim = window.Tim || {});
