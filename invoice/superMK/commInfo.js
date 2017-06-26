/**
 *
 */
$(function() {
    commInfoDAO.getShipList(function(data){
        var list = [];
        for(var i = 0; i < data.length; i++){
            list.push(data[i]['B_SHIP_ID']);
        }

        $("#shipNumber").autocomplete({
            source:list
        });
    });

    commInfoDAO.getOrderList(function(data){
        var orderList = [];
        for(var i = 0; i < data.length; i++){
            orderList.push(data[i]['O_PONumber'] + '--' + data[i]['O_DATE'])
        }
        $("#poNumber").autocomplete({
            source: orderList
        });
    });

    $("#plus").click(function(){
        var keyCode = $("input#keyCode").val().split("--");
        var poNumber=$("input#poNumber").val().split('--');
        var proInfo=$("input#localCode").val().split("--");
        if(poNumber[0] == ""){
            alert("Please input the PO. number!");
            return;
        }
        if(keyCode[0] == ""){
            alert("Please input the keycode!");
            return;
        }

        if(proInfo[0] == ""){
            alert("Please input the local code!");
            return;
        }

        $("#platform").before("<tr class='productList'>" +
            "<td>" + poNumber[0] + "</td>" +
            "<td>" + poNumber[1] + "</td>" +
            "<td>" + keyCode[0] + "</td>" +
            "<td>" + keyCode[1] + "</td>" +
            "<td>" + proInfo[0] + "</td>" +
            "<td>" + proInfo[1] + "</td>" +
            "<td><button class='btn' onClick='deltr(this)'>删除</button></td>" +
            "</tr>");
        $("#platform").prev('tr').data('info', {
            poNumber: poNumber[0],
            poDate: poNumber[1],
            keycode: keyCode[0],
            createTime: keyCode[1],
            localCode: proInfo[0]
        });
        $("input#keyCode").val("");
        $("input#poNumber").val("");
        $("input#localCode").val("");
    });

    $("#commInfoBtn").click(function(){
        if(!confirm("确定生成商检测资料？")){
            return;
        }
        var Data = getData();

        if($("#shipNumber").val()==""){
            alert("Please input the ship number!");
            return;
        }
        if($("#PODate").val()==""){
            alert("Please input the PO date!");
            return;
        }
        if($("#loadPort").val()==""){
            alert("Please input the load port!");
            return;
        }
        if(Data==""){
            alert("Please input the data!");
            return;
        }
        $("#commInfoModal").modal("show");
        $("#commInfoModal").showLoading();
        $.post(
            "./commInfoResult.php",
            {
                shipNumber:$("#shipNumber").val(),
                PODate:$("#PODate").val(),
                loadPort:$("#loadPort").val(),
                combine:$("#combine").val(),
                data: JSON.stringify(Data)
            },
            function(data){
                $("#commInfoLink").attr("href",data);
                $("#commInfoModal").hideLoading();
            }
        );
    });

    $("#PODate").datepicker({
        dateFormat:"yy.mm.dd",
        gotoCurrent:true,
        defaultDate:0,
        showButtonPanel:true
    });
});

function deltr(dom){
    $(dom).closest('tr').remove();
}

function showHint(){
    var str=$("input#poNumber").val().split('--');
    commInfoDAO.getInfoByOrder(str[0], str[1], function(data){
        var commList=[];
        for(var i = 0; i < data.length; i++){
            commList.push(data[i]['C_KEYCODE'] + '--' + data[i]['C_CREATE_TIME']);
        }
        $("input#keyCode").autocomplete({
            source:commList
        });
    });
}

function codeHint(){
    var str=$("input#keyCode").val().split('--');
    commInfoDAO.getInfoByKey(str[0], str[1], function(data){
        var proList = [];
        for(var i = 0; i < data.length; i++){
            proList.push(data[i]['P_LOCALCODE'] + '--' + data[i]['P_NAME']);
        }
        $("input#localCode").autocomplete({
            source: proList
        });
    });
}

function addHint(){
    var str = $("input#shipNumber").val().split('--');
    commInfoDAO.getInfoByShip(str[0], function(data){
        if(data.length==0){
            alert("此运编号下不存在需要商检的货物！");
        }else{
            for(var i = 0;i < data.length; i++){
                $("#platform").before("<tr class='productList'>" +
                    "<td>"+data[i]['B_PONUMBER']+"</td>" +
                    "<td>"+data[i]['O_DATE']+"</td>" +
                    "<td>"+data[i]['B_KEYCODE']+"</td>" +
                    "<td>"+data[i]['C_CREATE_TIME']+"</td>" +
                    "<td>"+data[i]['P_LOCALCODE']+"</td>" +
                    "<td>"+data[i]['P_NAME']+"</td>" +
                    "<td><button class='btn' onClick='deltr(this)'>删除</button></td>" +
                    "</tr>");
                $("#platform").prev('tr').data('info',  {
                    poNumber: data[i]['B_PONUMBER'],
                    poDate: data[i]['O_DATE'],
                    keycode: data[i]['B_KEYCODE'],
                    createTime: data[i]['C_CREATE_TIME'],
                    localCode: data[i]['P_LOCALCODE']
                });
            }
        }
    });
}

function getData(){
    var data = [];
    $('.productList').each(function(){
        data.push($(this).data('info'));
    });
    return data;
}

var commInfoDAO = {
    url: '/dataAdmin/commInfoServer.php',
    getShipList: function(callback){
        $.ajax({
            url: commInfoDAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getShipList'},
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
    },
    getOrderList: function(callback){
        $.ajax({
            url: commInfoDAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getOrderList'},
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
    },
    getInfoByShip: function(shipId, callback){
        $.ajax({
            url: commInfoDAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getInfoByShip', shipId: shipId},
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
    },
    getInfoByKey: function(keycode, createTime, callback){
        $.ajax({
            url: commInfoDAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getInfoByKey', keycode: keycode, createTime:createTime},
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
    },
    getInfoByOrder: function(poNumber, poDate, callback){
        $.ajax({
            url: commInfoDAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getInfoByOrder', poNumber: poNumber, poDate:poDate},
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