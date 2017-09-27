var mssql = require('mssql');
const config = {
    user: 'sa',
    password: '123456',
    server: 'localhost',
    database: 'tenpower',
    port:1433,
    /*pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 3000
    }*/
};

//执行sql,返回数据.
const query = function (sql, callBack) {
    var connection = new mssql.ConnectionPool(config, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        var ps = new mssql.PreparedStatement(connection);
        ps.prepare(sql, function (err) {
            //alert(sql);
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

module.exports = query;