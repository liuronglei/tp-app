var m_choose = require("./m_choose");

const choose_dx = {
    add_ng : function (dataArr) {
        m_choose.addNG(dataArr,function (err) {
            if(err) throw err;
        })
    },
    add_normal : function (dataArr) {
        m_choose.addNormal(dataArr,function (err) {
            if(err) throw err;
            m_choose.deleteNG(dataArr,function (err) {
                if(err) throw err;
            })
        });
    },
    select_normal : function (callback) {
        m_choose.query_normal(function (err,result) {
            if(err) throw err;
            callback(result);
        })
    }
};

module.exports = choose_dx;
