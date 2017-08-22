var query = require("../utils/sqlserver");
var Hashmap = require("../utils/hashmap");
const m_cssz = {
    csszSave :function (keyArr,valueArr,callback) {
        cssz_update(keyArr,valueArr,0,callback);
    },
    fillCsszMap : function (callback) {
        var hashmap = new Hashmap.Map();
        query('select * from p_cssz', function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.recordset.length; i++) {
                var record = result.recordset[i];
                var value = record.value;
                var name = record.name;
                hashmap.put(name, value);
            }
            callback(hashmap);
        });
    },
    query_csszInit :function (callback) {
        query('select * from p_cssz  order by sn ',callback)
    }
};

function cssz_update(keyArr,valueArr,key,callback) {
    if(key >= keyArr.length) {
        callback();
    } else {
        query('update p_cssz set value=' + valueArr[key] + ' where name=' + keyArr[key],function(){cssz_update(keyArr,valueArr,++key,callback)});
    }
}

module.exports = m_cssz;