/**
 * Created by flylxq on 24/06/2017.
 */
$(function(){
    DAO.getOrderInfo(function(data){
        var orderList = [];
        for(var i = 0; i < data.length; i++){
            orderList.push(data[i]['O_PONumber'] + '--' + data[i]['O_DATE']);
        }

        $("#poNumber").autocomplete({
            source:orderList
        });
    });


    $("#poNumber").blur(function(){
        var str = $("input#poNumber").val().split('--');
        DAO.getProductInfo(str[0], str[1], function(data){
            if(data.length <= 0){
                alert("请输入正确的PO号！");
                return;
            }

            var commList = [];
            for(var i = 0; i < data.length; i++){
                commList.push(data[i]['C_KEYCODE'] + "--" + data[i]['C_CREATE_TIME'] + "--" + data[i]['C_NAME_CN']);
            }
            $("input#keyCode").autocomplete({
                source:commList
            });
            $("input#keyCode").removeAttr("disabled");
        });
    });

    $("#poNumber").focus(function(){
        $("input#keyCode").attr("disabled","disabled");
    });

    $("#set").change(function(){
        if($("#set").val() == "manu"){
            $("#text").removeAttr("hidden");
            $("#uploadForm").css('display', 'none');
            $("#createDateDiv").attr("hidden","hidden");
        }else if($("#set").val() == "auto"){
            $("#text").attr("hidden","hidden");
            $("#createDateDiv").attr("hidden","hidden");
            $("#uploadForm").css('display', 'block');
        }else if($("#set").val() == "date"){
            $("#createDateDiv").removeAttr("hidden");
            $("#text").removeAttr("hidden");
            $("#uploadForm").css('display', 'none');
        }
    });

    $("#plus").click(function(){
        if($("input#poNumber").val()==""){
            alert("请输入PO号");
            return;
        }

        var poNumber = $("input#poNumber").val().split('--');

        if($("input#keyCode").val() == ""){
            if(confirm("确定加入该PO号下所有货物?")){
                var str=$("input#poNumber").val().split('--');
                if(str.length == 0){
                    return;
                }
                DAO.getProductInfoByPO(str[0], str[1], function(data){
                    if(data.length <= 0){
                        alert("请输入正确的PO号！");
                        return;
                    }
                    for(var i = 0;i < commList.length; i++){
                        $("#facPlatform").before("<tr class='productList'><td>"+poNumber[0]+"</td><td>"+poNumber[1]+"</td><td>"+data[i]['O_KEYCODE']+"</td><td>"+data[i]['C_CREATE_TIME']+"</td><td>"+data[i]['C_NAME_CN']+"</td><td><button class='btn' onClick='deltr(this)'><span class='glyphicon glyphicon-remove'></span>删除</button></td></tr>");
                        $("#facPlatform").prev('tr').data('info', {
                            'O_PONumber': poNumber[0],
                            'O_DATE': poNumber[1],
                            'C_KEYCODE': data[i]['O_KEYCODE'],
                            'C_CREATE_TIME': data[i]['C_CREATE_TIME'],
                            'C_NAME_CN': data[i]['C_NAME_CN']
                        });
                    }
                });
            }
        } else {
            var all = $("input#keyCode").val().split("--");
            if(all.length != 3){
                alert("货物信息输入格式不正确！");
                return;
            }
            $("#facPlatform").before("<tr class='productList'><td>"+poNumber[0]+"</td><td>"+poNumber[1]+"</td><td>"+all[0]+"</td><td>"+all[1]+"</td><td>"+all[2]+"</td><td><button class='btn' onClick='deltr(this)'><span class='glyphicon glyphicon-remove'></span>删除</button></td></tr>");
            $("#facPlatform").prev('tr').data('info', {
                'O_PONumber': poNumber[0],
                'O_DATE': poNumber[1],
                'C_KEYCODE': all[0],
                'C_CREATE_TIME': all[1],
                'C_NAME_CN': all[2]
            });
            $("input#keyCode").val("");
        }
        $("input#poNumber").val("");
        $("input#keyCode").attr("disabled","disabled");
    });

    $("#signDate, #createDate").datepicker({
        dateFormat:"yy/mm/dd",
        gotoCurrent:true,
        defaultDate:0,
        showButtonPanel:true
    });

    $("#createDateBtn").click(function(){
        DAO.getProductInfoByDate($("input#createDate").val(), function(data){
            if(data.length == 0){
                alert("There is no order on this date!");
                return;
            }
            for(var i = 0; i < data.length; i++){
                $("#facPlatform").before("<tr class='productList'><td>" + data[i]['O_PONumber'] + "</td><td>" + data[i]['O_DATE'] + "</td><td>" + data[i]['C_KEYCODE'] + "</td><td>" + data[i]['C_CREATE_TIME'] + "</td><td>" + data[i]['C_NAME_CN'] + "</td><td><button class='btn btn-error' onClick='deltr(this)'><span class='glyphicon glyphicon-remove'></span>删除</button></td></tr>");
                $("#facPlatform").prev('tr').data('info', data[i]);
            }
        });
    });

    $("#facVoiceBtn").click(function(){
        if(!confirm("确定生成工厂合同？")){
            return;
        }
        var Data = getData(),
            productInfo = [];
        for(var i = 0; i < Data.length; i++){
            productInfo.push({
                poNumber: Data[i]['O_PONumber'],
                keycode: Data[i]['C_KEYCODE'],
                poDate: Data[i]['O_DATE'],
                validDate: Data[i]['O_CREATE_DATE']
            });
        }

        if($("#signDate").val()==""){
            alert("Please input the sign date!");
            return;
        }
        if($("#createDate").val()==""){
            alert("Please input the PO created date!");
            return;
        }
        if(Data.length == 0){
            alert("Please input the data!");
            return;
        }
        $("#facVoiceModal").modal("show");
        $("#facVoiceModal").showLoading();
        $.post(
            "./factoryInvoiceResult.php",
            {type:"manu", signDate:$("#signDate").val(), data:JSON.stringify(productInfo), number:$("#number").val()},
            function(data){
                $("#facVoiceLink").attr("href",data);
                $("#facVoiceModal").hideLoading();
            }
        );
    });

    if(filename != ""){
        $("#facVoiceDiv").dialog("open");
        $("#facVoiceDiv").showLoading();
        $.get(
            "./factoryInvoiceResult.php",
            {type:"auto",signDate:$("#signDate").val(),file:filename,number:$("#number").val()},
            function(data){
                $("#facVoiceLink").attr("href",data);
                $("#facVoiceDiv").hideLoading();
                filename = "";
            }
        );
    }

    $("#facVoiceLink").click(function(){
        $("#facVoiceDiv").dialog("close");
    });
});

function deltr(dom){
    var $target = $(dom).closest('tr');
    $target.remove();
}

function formSubmit(){
    document.getElementById("form1").submit();
}

function getData(){
    var data = [];
    $(".productList").each(function(){
        data.push($(this).closest('tr').data('info'));
    });
    return data;
}

var DAO = {
    url: '/dataAdmin/factoryServer.php',
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
    getProductInfo: function(poNumber, poDate, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getProductInfo', poNumber: poNumber, poDate:poDate},
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
    getProductInfoByDate: function(createDate, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getProductInfoByDate', createDate: createDate},
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
    getProductInfoByPO: function(poNumber, poDate, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getProductInfoByDate', createDate: createDate, poDate: poDate},
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
}