/**
 * Created by flylxq on 24/06/2017.
 */
$(function(){
    customInfoDAO.getShipList(function(data){
        var shipList = [];
        for(var i = 0; i < data.length; i++){
            shipList.push(data[i]['B_SHIP_ID']);
        }
        $("#shipNumber").autocomplete({
            source: shipList
        });
    });

    $("#submit").click(function(){
        if($("#shipNumber").val()==""){
            alert("运编号不能为空！");
            return;
        }
        if($("#set").val()=="auto"){
            $("#customInfoModal").modal("show");
            $("#customInfoModal").showLoading();
            $.get(
                "./customInfoResult.php",
                {
                    shipNumber:$("#shipNumber").val(),
                    PODate:$("#PODate").val(),
                    Unit:$("#Unit").val(),
                    combine:$("#combine").val()
                },
                function(data){
                    $("#customInfoLink").attr("href",data);
                    $("#customInfoModal").hideLoading();
                }
            );
        } else {
            var Data = getData();
            $("#customInfoModal").modal("show");
            $("#customInfoModal").showLoading();
            $.get(
                "./customInfoResultM.php",
                {
                    shipNumber: $("#shipNumber").val(),
                    PODate: $("#PODate").val(),
                    Unit:$("#Unit").val(),
                    combine:$("#combine").val(),
                    data: JSON.stringify(Data)
                },
                function(data){
                    $("#customInfoLink").attr("href",data);
                    $("#customInfoModal").hideLoading();
                }
            );
        }
    });

    $("#set").change(function(){
        if($("#set").val()=="auto"){
            $("#paoZhi").css("display","none");
        }else{
            $("#paoZhi").css("display", "block");
        }
    });
});

function getData(){
    var data = {};
    for(var i = 0; i < 5; i++){
        data["zhiQ" + i] = $("#zhiQ" + i).val();
        data["zhiP" + i] = $("#zhiP" + i).val();
        data["paoQ" + i] = $("#paoQ" + i).val();
        data["paoP" + i] = $("#paoP" + i).val();
    }
    var zhi = $("#zhiIntro").val().replace(/\n/g,"\\n").replace(/\t/g," ");
    var pao = $("#paoIntro").val().replace(/\n/g,'\\n').replace(/\t/g," ");
    data["zhiIntro"] = zhi;
    data["paoIntro"] = pao;

    return data;
}

var customInfoDAO = {
    url: '/dataAdmin/commInfoServer.php',
    getShipList: function(callback){
        $.ajax({
            url: customInfoDAO.url,
            method: 'POST',
            dataType: 'json',
            data: {method: 'getShipList'},
            success: function(rsp){
                if(!rsp.success){
                    alert('查询数据失败:' + rsp.message);
                    return;
                }

                callback(rsp.data);
            },
            error: function(jqXHR, status, errorThrown){
                alert('查询数据失败' + status + ":" + errorThrown);
            }
        });
    }
}