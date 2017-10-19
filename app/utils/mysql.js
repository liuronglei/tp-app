/**
 * 数据库工具类_mysql
 * Created by liurong on 2017/8/10.
 */
const mysql = require("mysql");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'uppermonitor',
    password: 'uppermonitor',
    database: 'barcode',
    port: '3306'
});
const query = function(sql,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr,vals,fields);
            });
        }
    });
};
module.exports = query;