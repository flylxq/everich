/**
 *
 */
var listNumber = 1;
$(function() {
    var orderList = [];
    DAO.getOrderInfo(function(data){
        for(var i = 0; i < data.length; i++){
            orderList.push(data[i]['O_PONumber'] + '--' + data[i]['O_DATE']);
        }
        $("#poNumber").autocomplete({
            source:orderList
        });
        $("#shipPONumber").autocomplete({
            source:orderList
        });
    });

    DAO.getShipInfo(function(data){
        var list = [];
        for(var i = 0; i < data.length; i++){
            list.push(data[i]['B_SHIP_ID']);
        }
        $("#shipNumber").autocomplete({
            source: list
        });
    });

    $("#poNumber").blur(function(){
        var str = $("input#poNumber").val(),
            $input = $("input#keyCode");
        showHint(str, $input);
    }).focus(function(){
        $("input#keyCode").attr("disabled","disabled");
    });

    $("#orderDate").datepicker({
        inline:true,
        dateFormat:"yy-mm-dd",
        gotoCurrent:true,
        defaultDate:0,
    });

    $("#plus").click(function(){
        var all = $("input#keyCode").val().split("--");
        var poNumber=$("input#poNumber").val().split('--');
        $("#shipInfoPlatform").before("<tr class='productList'>" +
            "<td>" + listNumber + "</td>" +
            "<td>"+poNumber[0]+"</td>" +
            "<td>"+poNumber[1]+"</td>" +
            "<td>"+all[0]+"</td>" +
            "<td>"+all[1]+"</td>" +
            "<td>"+all[3]+"</td>" +
            "<td>"+all[2]+"</td>" +
            "<td><button class='btn' onClick='deltr(this)'>删除</button></td>" +
            "</tr>");
        $("#shipInfoPlatform").prev('tr').data('info', {
            poNumber: poNumber[0],
            poDate: poNumber[1],
            keycode: all[0],
            createTime: all[1]
        });
        listNumber++;
        if($("#totalNumber").text() == "Total"){
            $("#totalNumber").text(all[3]);
        }else{
            $("#totalNumber").text(parseInt(all[3]) + parseInt($("#totalNumber").text()));
        }
        $("input#keyCode").val("");
        $("input#keyCode").attr("disabled","disabled");
        $("input#poNumber").val("");
    });

    $("#orderDate").change(function(){
        var data = $(this).val();
        $.post(
            "./dataChange.php",
            {type:'dateChange',data:data},
            function(data){
                $("#DeliverDate").val(data);
            }
        );
    });

    $("#shipInfoBtn").click(function(){
        if(!confirm("确定生成定舱资料？")){
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
        if(Data.length == 0){
            alert("Please input the data!");
            return;
        }
        $("#shipInfoModal").modal("show");
        $("#shipInfoModal").showLoading();
        $.post(
            "./shipInfoResult.php",
            {
                shipNumber: $("#shipNumber").val(),
                PODate: $("#PODate").val(),
                loadPort: $("#LoadPort").val(),
                deliverDate: $("#DeliverDate").val(),
                type: $("#type").val(),
                data: JSON.stringify(Data),
                template:$("#template").val()
            },
            function(data){
                if(data == '1'){
                    alert("该运编号已经存在，请直接生成!");
                    $("#shipInfoDiv").hideLoading();
                    return;
                }
                if(data == "2"){
                    alert("该运编号已经存在!");
                    $("#shipInfoDiv").hideLoading();
                    return;
                }
                if(data == "3"){
                    alert("订舱资料已经录入!");
                    $("#shipInfoDiv").hideLoading();
                    return;
                }
                $("#shipInfoLink").attr("href",data);
                $("#shipInfoModal").hideLoading();
            }
        );
    });

    var shipIndex = "";
    $("#shipInfoListBtn").click(function(){
        DAO.getShipList(function(data){
            var line = "";
            for(var i = 0; i < data.length; i++){
                line += '<li><input type="checkbox" class="shipInfoLink" id="' + data[i]['B_SHIP_ID'] + '" /><a class="infoLink">' + data[i]['B_SHIP_ID'] + '</a></li>';
            }
            $("#shipList li").remove();
            $("#shipList").append(line);

            $("#shipPONumber").blur(function(){
                var str = $("#shipPONumber").val();
                showHint(str, $("input#shipKeycode"));
            });

            $("#shipAddBtn").click(function(){
                if(shipIndex == ""){
                    alert("请先点击需要增加的运编号！");
                    return;
                }
                var poNumber = $("input#shipPONumber").val().split('--')[0];
                var proInfo = $("input#shipKeycode").val().split('--');
                var keycode = proInfo[0],
                    name = proInfo[2];
                var line = '<li><input type="checkbox" class="listCheck" />' + poNumber + " " + keycode + " " + name + '</li>';
                $("#shipInfoList").append(line);
                $("input#shipPONumber").val("");
                $("input#shipKeycode").val("");
                DAO.addOrder(shipIndex, poNumber, keycode, function(){
                    alert(poNumber + "--" + keycode + "--" + name + ' is successfully added.');
                });
            });

            $("#deleteProBtn").click(function(){
                $(":checked[class=listCheck]").each(function(){
                    var delIndex = $(this).parent();
                    var orderInfo = $(this).parent().text().split(" ");
                    DAO.deleteOrder(shipIndex, orderInfo[0], orderInfo[1], function(){
                        delIndex.remove();
                        alert(orderInfo[0] + "--" + orderInfo[1] + " has been removed.");
                    });
                });
            });

            $("#shipAdminModal").modal("show");

            $(".infoLink").click(function(){
                shipIndex = $(this).text();
                DAO.getShipInfoList(shipIndex, function(data){
                    var line = "";
                    for(var i = 0; i < data.length; i++){
                        line += "<li><input type='checkbox' class='listCheck' id='" + data[i]['O_ID']+ "' />" + data[i]['B_PONUMBER'] + " " + data[i]['B_KEYCODE'] + " " + data[i]['C_NAME_CN'] + "</li>";
                    }
                    $("#shipInfoList li").remove();
                    $("#shipInfoList").append(line);
                });
            });
        });
    });

    $("#shipListSelect").click(function(){
        $(".listCheck").prop("checked",$("#shipListSelect").prop("checked"));
    });

    $("#shipNumberListSelect").click(function(){
        $(".shipInfoLink").prop("checked",$("#shipNumberListSelect").prop("checked"));
    });

    $("#delShipBtn").click(function(){
        $(":checked[class=shipInfoLink]").each(function(){
            var $target = $(this);
            DAO.deleteShip($target.attr('id'), function(){
                $target.parent().remove();
            })
        });
    });

    $("#orderDateBtn").click(function(){
        DAO.getInfoByDate($("input#orderDate").val(), $("select#showall").val(), function(data){
            if(data.length == 0){
                alert("此日期下没有未定舱的定单！");
            }else{
                var dateTotal = 0;
                for(var i = 0; i < data.length; i++){
                    var total = getTotal(data[i]);
                    $("#shipInfoPlatform").before("<tr class='productList'>" +
                        "<td>" + listNumber + "</td>" +
                        "<td>"+data[i]['O_PONumber']+"</td>" +
                        "<td>"+data[i]['O_DATE']+"</td>" +
                        "<td>"+data[i]['C_KEYCODE']+"</td>" +
                        "<td>"+data[i]['C_CREATE_TIME']+"</td>" +
                        "<td>"+ total +"</td>" +
                        "<td>"+data[i]['C_NAME_CN']+"</td>" +
                        "<td><button class='btn btn-danger' onClick='deltr(this)'>删除</button>" +
                        "</tr>");
                    $("#shipInfoPlatform").prev('tr').data('info', {
                        poNumber: data[i]['O_PONumber'],
                        poDate: data[i]['O_DATE'],
                        keycode: data[i]['C_KEYCODE'],
                        createTime: data[i]['C_CREATE_TIME']
                    });
                    listNumber++;
                    dateTotal += total;
                }
                if($("#totalNumber").text() == "Total"){
                    $("#totalNumber").text(dateTotal);
                }else{
                    $("#totalNumber").text(dateTotal + parseInt($("#totalNumber").text()));
                }
            }
        });
    });
});

function deltr(dom){
    $(dom).closest('tr').nextAll('tr').each(function(){
        var $td = $(this).find('td:first');
        $td.text(Number($td.text()) - 1);
    })
    $(dom).closest('tr').remove();
    listNumber--;
}

function getTotal(data) {
    return parseInt(data[i]['O_SYDNEY']) +
        parseInt(data[i]['O_MELBOURNE']) +
        parseInt(data[i]['O_BRISBANE']) +
        parseInt(data[i]['O_PERTH']) +
        parseInt(data[i]['O_AUCKLAND']) +
        parseInt(data[i]['lyt']);
}

function showHint(str, $input){
    str = str.split('--');
    if(str.length < 2){
        return;
    }
    $.post(
        "/dataAdmin/factoryServer.php",
        {method: 'getProductInfo', poNumber:str[0], poDate:str[1] },
        function(rsp){
            var data = rsp.data;
            if($input.attr("disabled") != false){
                $input.removeAttr("disabled");
            }
            var commList = [];
            for(var i = 0; i < data.length; i++){
                var total = getTotal(data[i]);
                commList.push(data[i]['C_KEYCODE'] + '--' + data[i]['C_CREATE_TIME'] + '--' + data[i]['C_NAME_CN'] + '--' + total);
            }
            $input.autocomplete({
                source:commList
            });
        },
        'json'
    );
}

function addHint(){
    var str = $("input#shipNumber").val().split('--');
    DAO.getInfoByShip(str[0], function(data){
        if(data.length == 0){
            alert("此运编号不存在！");
        }else{
            var totalNumber = 0;
            for(var i = 0; i < data.length; i++){
                var total = getTotal(data[i]);
                $("#shipInfoPlatform").before("<tr class='productList'>" +
                    "<td>" + listNumber + "</td>" +
                    "<td>"+data[i]['B_PONUMBER']+"</td>" +
                    "<td>"+data[i]['O_DATE']+"</td>" +
                    "<td>"+data[i]['B_KEYCODE']+"</td>" +
                    "<td>"+data[i]['C_CREATE_TIME']+"</td>" +
                    "<td>" + total + "</td>" +
                    "<td>"+data[i]['C_NAME_CN']+"</td>" +
                    "<td><button class='btn btn-danger' onClick='deltr(this)'>删除</button></td>" +
                    "</tr>");
                $("#shipInfoPlatform").prev('tr').data('info', {
                    poNumber: data[i]['B_PONUMBER'],
                    poDate: data[i]['O_DATE'],
                    keycode: data[i]['B_KEYCODE'],
                    createTime: data[i]['C_CREATE_TIME']
                });
                listNumber++;
                totalNumber += total;
            }
            if($("#totalNumber").text() == "Total"){
                $("#totalNumber").text(totalNumber);
            }else{
                $("#totalNumber").text(totalNumber + parseInt($("#totalNumber").text()));
            }
        }
    });
}

function getData(){
    var data = [];
    $(".productList").each(function(){
        data.push($(this).closest('tr').data('info'));
    })
    return data;
}

var DAO = {
    url: '/dataAdmin/shipInfoServer.php',
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
    getShipInfo: function(callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getShipInfo'},
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
            url: DAO.url,
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
    getInfoByDate: function(orderDate, showall, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getInfoByDate', showall: showall, orderDate: orderDate},
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
    deleteShip: function(shipId, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'deleteShip', shipId: shipId},
            success: function(rsp){
                if(!rsp.success){
                    alert('查询数据失败:' + rsp.message);
                    return;
                }

                callback();
            },
            error: function(jqXHR, status, errorThrown){
                alert('查询数据失败' + status + ":" + errorThrown);
            }
        });
    },
    getShipList: function(callback){
        $.ajax({
            url: DAO.url,
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
    getShipInfoList: function(shipId, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'getShipInfoList', shipId: shipId},
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
    addOrder: function(shipId, poNumber, keycode, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'addOrder', shipId: shipId, poNumber: poNumber, keycode: keycode},
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
    deleteOrder: function(shipId, poNumber, keycode, callback){
        $.ajax({
            url: DAO.url,
            method: 'POST',
            dataType: 'json',
            data:{method: 'deleteOrder', shipId: shipId, poNumber: poNumber, keycode: keycode},
            success: function(rsp){
                if(!rsp.success){
                    alert('查询数据失败:' + rsp.message);
                    return;
                }

                callback();
            },
            error: function(jqXHR, status, errorThrown){
                alert('查询数据失败' + status + ":" + errorThrown);
            }
        });
    }
}