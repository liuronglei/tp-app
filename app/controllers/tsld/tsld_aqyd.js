/**
 * Created by lenovo on 2017/6/3.
*/
var m_tsld = require('../../models/m_tsld');
$(document).ready(function(){
    tableInit();
    $("#dy_table").FixedHead({ tableLayout: "fixed" });
    $("#dl_table").FixedHead({ tableLayout: "fixed" });
});

function tableInit() {
    m_tsld.querySbList(function (error, results, fields) {
        if (error) throw error;
        for(var i=0; i<results.length; i++) {
            jQuery("<tr><td>" + results[i].sbid
                + "</td><td nowrap>" + results[i].bdzmc+ results[i].sbmc
                + "</td><td>" + results[i].aqyd
                + "</td></tr>").appendTo("#dy_tbody");
            jQuery("<tr><td>" + results[i].sbid
                + "</td><td nowrap>" + results[i].bdzmc+ results[i].sbmc
                + "</td><td>" + results[i].aqyd
                + "</td></tr>").appendTo("#dl_tbody");
        }
    });
}