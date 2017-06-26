/**
 * Created by Xiaoqing Liu
 * 2016/01/30
 */
$(function() {
    DAO.getOrderInfo(function(data){
        var list = [];
        for(var i = 0; i < data.length; i++){
            list.push(data[i]['O_PONumber'] + '--' + data[i]['O_CREATE_DATE'] + '--' + data[i]['O_DATE']);
        }
        $("#poNumber").autocomplete({
            source:list
        });
    });

    DAO.getFactoryInfo(function(data){
        var list = [];
        for(var i = 0; i < data.length; i++){
            list.push(data[i]['F_AddNAME']);
        }
        $("#factory").autocomplete({
            source: list
        });
    });

    function getTotal(data) {
        return (Number(data['O_SYDNEY']) + Number(data['O_MELBOURNE']) + Number(data['O_BRISBANE']) + Number(data['O_PERTH']) + Number(data['O_AUCKLAND']) + Number(data['lyt']))
    }

    $("#poNumber").blur(function(){
        var commList=[];
        var str=$("input#poNumber").val().split("--");
        if(str.length == 0){
            return;
        }
        DAO.getProductInfo(str[0], str[2], function(data){
            var commList = [];
            for(var i=0; i < data.length; i++){
                var packNum = Math.ceil(getTotal(data[i]) / Number(data[i]['C_PACK_NUMBER']));
                commList.push(data[i]['C_KEYCODE'] + "--" + data[i]['C_CREATE_TIME'] + "--" + data[i]['C_NAME_CN'] + '--' + data[i]['C_PACK_NUMBER'] + '--' + packNum);
            }
            if($("input#keyCode").attr("disabled") != false){
                $("input#keyCode").removeAttr("disabled");
            }
            $("input#keyCode").autocomplete({
                source:commList
            });
        });
    });

    $("#PODate, #POCreateDate, #PODateEnd, #inspection").datepicker({
        dateFormat:"yy-mm-dd",
        gotoCurrent:true,
        defaultDate:0,
        showButtonPanel:false,
    });

    $("#poNumber").focus(function(){
        $("input#keyCode").attr("disabled","disabled");
    });

    $("#PODate, #PODateEnd").change(function(){
        var startTime = $("#PODate").val(),
            endTime = $("#PODateEnd").val();

        DAO.getFacInfo(startTime, endTime, function(data){
            $("#facSelect").find('option').remove();
            for(var i=0; i < data.length; i++){
                $("#facSelect").append("<option value='" + data[i]['C_CHECK_FAC'] + "'>" + data[i]['C_CHECK_FAC'] + "</option>");
            }
        });
    });

    $("#facBtn").click(function(){
        $(this).closest('body').showLoading();
        DAO.getInfoByFac($("#PODate").val(), $("#PODateEnd").val(), $("#facSelect").val(), function(data){
            for(var i = 0; i < data.length; i++){
                var packNum = Math.ceil(getTotal(data[i]) / Number(data[i]['C_PACK_NUMBER']));
                $("#inspectInfoPlatform").before("<tr class='productList'>" +
                    "<td>"+data[i]['O_PONumber']+"</td>" +
                    "<td>"+data[i]['O_CREATE_DATE']+"</td>" +
                    "<td>"+data[i]['O_DATE']+"</td>" +
                    "<td>"+data[i]['C_KEYCODE']+"</td>" +
                    "<td>"+data[i]['C_CREATE_TIME']+"</td>" +
                    "<td>"+data[i]['C_NAME_CN']+"</td>" +
                    "<td>" + data[i]['C_PACK_NUMBER'] + "</td>" +
                    "<td>" + packNum +"</td>" +
                    "<td><button class='btn' onClick='deltr(this)'>删除</button></td>" +
                    "</tr>");
                $("#inspectInfoPlatform").prev('tr').data('info', {
                    poNumber: data[i]['O_PONumber'],
                    keycode: data[i]['C_KEYCODE'],
                    createTime: data[i]['C_CREATE_TIME']
                });
                $(this).closest('body').hideLoading();
            }
        });
    });

    $("#plus").click(function(){
        var all = $("input#keyCode").val().split("--");
        var poNumber=$("input#poNumber").val().split("--");
        $("#inspectInfoPlatform").before("<tr class='productList'>" +
            "<td>"+poNumber[0]+"</td>" +
            "<td>"+poNumber[1]+"</td>" +
            "<td>"+poNumber[2]+"</td>" +
            "<td>"+all[0]+"</td>" +
            "<td>"+all[1]+"</td>" +
            "<td>"+all[2]+"</td>" +
            "<td>"+all[3]+"</td>" +
            "<td>"+all[4]+"</td>" +
            "<td><button class='btn' onClick='deltr(this)'>删除</button></td></tr>");
        $("#inspectInfoPlatform").prev('tr').data('info', {
            poNumber: poNumber[0],
            keycode: all[0],
            createTime: all[1]
        });

        $("input#keyCode").val("");
        $("input#poNumber").val("");
        $("input#keyCode").attr("disabled","disabled");
    });

    $("#POCreateDateBtn").click(function(){
        $(this).closest('body').showLoading();
        DAO.getInfoByDate($("input#POCreateDate").val(), function(data){
            $(this).closest('body').hideLoading();
            if(data.length == 0){
                alert("There is no order on this date!");
                return;
            }
            for(var i = 0; i < data.length; i++){
                var total = getTotal(data[i]);
                $("#inspectInfoPlatform").before("<tr class='productList'>" +
                    "<td>" + data[i]['O_PONumber'] + "</td>" +
                    "<td>" + data[i]['O_CREATE_DATE'] + "</td>" +
                    "<td>" + data[i]['O_DATE'] + "</td>" +
                    "<td>" + data[i]['C_KEYCODE'] + "</td>" +
                    "<td>" + data[i]['C_CREATE_TIME'] + "</td>" +
                    "<td>" + data[i]['C_NAME_CN'] + "</td>" +
                    "<td>" + data[i]['C_PACK_NUMBER'] + "</td>" +
                    "<td>" + total + "</td>" +
                    "<td><button class='btn' onClick='deltr(this)'>删除</button></td></tr>");
                $("#inspectInfoPlatform").prev('tr').data('info', {
                    poNumber: data[i]['O_PONumber'],
                    keycode: data[i]['C_KEYCODE'],
                    createTime: data[i]['C_CREATE_TIME']
                });
            }
        });
    });

    $("#inspectInfoBtn").click(function(){
        var date = $("#inspection").val();
        var factory = $("#facSelect").val();
        var data = getData();
        $("#inspectInfoModal").modal("show");
        $("#inspectInfoModal").showLoading();
        $.post(
            "./checkInfoResult.php",
            {date:date, factory:factory, data:JSON.stringify(data)},
            function(data){
                $("#inspectInfoLink").attr("href",data);
                $("#inspectInfoModal").hideLoading();
            }
        );
    });
});


function deltr(dom){
    $(dom).closest('tr').remove();
}

function getData(){
    var data = [];
    $(".productList").each(function(){
        data.push($(this).closest('tr').data('info'));
    });
    return data;
}


var DAO = {
    url: '/dataAdmin/checkInfoServer.php',
    getOrderInfo: function(callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getOrderInfo'},
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
    getFactoryInfo: function(callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getFactoryInfo'},
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
    getProductInfo: function(poNumber, poDate, callback){
        $.ajax({
            url: '/dataAdmin/commInfoServer.php',
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
    },
    getFacInfo: function(startTime, endTime, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getFacInfo', startTime: startTime, endTime: endTime},
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
    getInfoByFac: function(startTime, endTime, factory, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getInfoByFac', startTime: startTime, endTime: endTime, factory: factory},
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
    getInfoByDate: function(createDate, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getInfoByDate', createDate: createDate},
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