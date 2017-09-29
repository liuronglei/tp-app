var mssql = require('mssql');
const config = {
    user: 'sa',
    password: '123456',
    server: 'localhost',
    database: 'TianPeng',
    port:1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 3000
    }
};
var pool = new mssql.ConnectionPool(config);
const query = function (sql, callBack) {
    pool.connect(function(err) {
        pool.request().query(sql, function(err, result) {
            callBack(err, result);
        });
    });
};
module.exports = query;

//执行sql,返回数据.
/*
const query = function (sql, callBack) {
    var connection = new mssql.ConnectionPool(config, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        var ps = new mssql.PreparedStatement(connection);
        ps.prepare(sql, function (err) {
            //console.log(sql);
            if (err){
                console.log(err);
                return;
            }
            ps.execute('', function (err, result) {
                if (err){
                    console.log(err);
                    return;
                }
                ps.unprepare(function (err) {
                    if (err){
                        console.log(err);
                        callback(err,null);
                        return;
                    }
                    callBack(err, result);
                    connection.close();
                });
            });
        });
    });
};
 */