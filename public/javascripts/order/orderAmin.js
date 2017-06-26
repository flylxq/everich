/**
 * Created by Xiaoqing Liu
 * 2016/01/30
 */

var colorList= new Array("#FFFFFF","#948A54","#538DD5","#95B3D7","#D59693","#C4D29B'","#B1A0C3","#FAAF8F");

var editId="";

var listNumber = 1;
$(function(){
    Pagination.init(function(options){
        if(!options.dateS || options.dateS.trim().length === 0) {
            options.dateS = '2016-01-01';
        }
        OrderDAO.getData(options);
    });
    var option = {page: 1, size: 100, dateS: '2016-01-01'};
    OrderDAO.getData(option);

    $("#searchComm3, #searchComm3E").datepicker({
        dateFormat:"yy-mm-dd",
        gotoCurrent:true,
        defaultDate:0,
        showButtonPanel:true,
    });
    $("#PODate, #DeliverDate, #CreateDate, #EPODate, #EDeliverDate, #EDeliverDate, #updateFacVoiceSignDate, #excelDateStart, #excelDateEnd").datepicker({
        inline:true,
        dateFormat:"yy-mm-dd",
        gotoCurrent:true,
        defaultDate:0,
        showButtonPanel:true,
    });

    //增加订单
    $("#addProduct").click(function(){
        OrderDAO.getCommList(function(data){
            for(var i = 0; i < data.length; i++){
                $("#keyCode").append("<option>" + data[i]['C_KEYCODE'] + "--" + data[i]['C_CREATE_TIME'] + "--" + data[i]['C_NAME_CN'] + "</option>");
            }
            $("#keyCode").select2({
                width: '100%',
                height: '100%'
            });
            $("#addOrderModal").modal("show");
        });
    });

    $("button#orderExcel").click(function(){
        $("#orderExcelModal").data('method', 'excel').modal("show");
        $("#orderExceldownPart").css("display","none");
    });
    $("button#orderExcelAid").click(function(){
        $("#orderExcelModal").data('method', 'excelAid').modal("show");
        $("#orderExceldownPart").css("display","none");
    });
    $("button#updateSchedule").click(function(){
        $("#orderExcelModal").data('method', 'schedule').modal("show");
        $("#orderExceldownPart").css("display","none");
    });

    $("button#getOrderExcelBtn").click(function(){
        $("#orderExcelModal").showLoading();
        $("#orderExceldownPart").css("display","none");
        var method = $(this).closest('.modal').data('method');
        $.post(
            "./orderExcel.php",
            {method: method, type: $("#excelDateType").val(), start:$("#excelDateStart").val(), end:$("#excelDateEnd").val()},
            function(data){
                $("#orderExcelLink").attr("href",data);
                $("#orderExceldownPart").css('display', 'block');
                $("#orderExcelModal").hideLoading();
            }
        );
    });

    $("button#matchExcel").click(function(){
        $("#matchModal").modal('show');
    });

    $("#plus").click(function(){
        var all = $("select#keyCode").select2('data').text.split('--');
        var syn = $("#SYD").val();
        if(syn == ""){
            syn = 0;
        }
        var mel = $("#MEL").val();
        if(mel == ""){
            mel = 0;
        }
        var bri = $("#BRI").val();
        if(bri == ""){
            bri = 0;
        }
        var per = $("#PER").val();
        if(per == ""){
            per = 0;
        }
        var auc = $("#AUC").val();
        if(auc == ""){
            auc = 0;
        }

        var lyt = $("#LYT").val() || 0;

        $("#platform").before("<tr class='orderList'>" +
            "<td>" + listNumber+"</td>" +
            "<td><button class='btn btn-warning' onClick='deltr(this)'><span class='glyphicon glyphicon-remove'></span>删除</botton></td>" +
            "<td>" + all[0] + "</td>" +
            "<td>" + all[1] + "</td>" +
            "<td>" + all[2] + "</td>" +
            "<td>" + syn + "</td>" +
            "<td>" + mel + "</td>" +
            "<td>" + bri + "</td>" +
            "<td>" + per + "</td>" +
            "<td>" + auc + "</td>" +
            "<td>" + lyt + "</td>" +
            "</tr>");
        $('#proList').find('tr.orderList:last').data('info', {keycode: all[0], syn: syn, mel: mel, bri: bri, per: per, auc: auc, lyt: lyt});
        listNumber++;

        $("input#keyCode").val("");
        $("input#SYD").val("");
        $("input#MEL").val("");
        $("input#BRI").val("");
        $("input#PER").val("");
        $("input#AUC").val("");
        $("input#LYT").val("");
    });

    $("#inputExcel").click(function(){
        $("#inputExcelModal").modal('show');
    });

    $("#addOrderConfirmBtn").click(function(){
        if($("#PONumber").val()==""){
            alert("请输入订单号");
            return;
        }

        if(confirm("确定结束增加,并提交定单？")){
            var orderList = [];
            $("#proList").find('tr.orderList').each(function(){
                orderList.push($(this).data('info'));
            });

            OrderDAO.addOrder(orderList,
                {
                    PONumber: $("#PONumber").val(),
                    PODate: $("#PODate").val(),
                    CreateDate: $("#CreateDate").val(),
                    DeliverDate: $("#DeliverDate").val()
                },
                function(){
                    $("#addOrderModal").modal("hide");
                    $("#proList").find('tr[id^="list"]').remove();
                    listNumber = 1;
                    $("#searchComm1").val($("#PONumber").val());
                    $("#PONumber").val("");
                    $("#PODate").val("");

                    OrderDAO.getData({page: 1, size: 100, poNumber: $("#searchComm1").val()});
                });
        }
    });

    $("#editOrderBtn").click(function(){
        var options = {
            id: $(this).closest('.modal').data('editId'),
            CreateDate: $("#ECreateDate").val(),
            PODate: $("#EPODate").val(),
            PONumber: $("#EPONumber").val(),
            keycode: $("#EKeycode").val(),
            SYDNEY: $("#ESYDNEY").val(),
            MELBOURNE: $("#EMELBOURNE").val(),
            BRISBANE: $("#EBRISBANE").val(),
            PERTH: $("#PERTH").val(),
            AUCKLAND: $("#EAUCKLAND").val(),
            lyt: $("#ELYT").val(),
            DeliverDate: $("#EDeliverDate").val()
        };
        OrderDAO.editOrder(options, function(){
            $("#searchComm1").val(options.PONumber);
            $("#select1").val("and");
            $("#searchComm2").val(options.keycode);
            $("#searchButton").trigger('click');
            $("#editOrderModal").modal("hide");
        });
    });

    $("#matchExcel").click(function(){
        $("#matchModal").modal("show");
    });

    $("#searchButton").click(function(){
        var options = getOptions();
        options.page = 1;
        options.size = 100;

        OrderDAO.getData(options);
    });

    $('.yearLink').click(function(){
        var year = $(this).attr('data-value');
        $('#searchComm3').val(year + '-01-01');
        $('#searchComm3E').val(year + '-12-31');
        var options = getOptions();
        options.page = 1;
        options.size = 100;
        OrderDAO.getData(options);
    });

    OrderDAO.getWarn(function(data){
        if(data['factory'] > 0){
            var line = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>提醒!</strong><a class="warnLink" id="factory"><strong>'+ data['factory'] +'</strong>个需要生成<strong>工厂合同</strong>的定单，在30-45天内到期，请核对定单</a></div>';
            $("#warnDiv").append(line);
        }
        if(data['check'] > 0){
            var line = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>提醒!</strong><a class="warnLink" id="check"><strong>'+ data['check'] +'</strong>个需要生成<strong>验货申请</strong>的定单，在15-30天内到期，请核对定单</a></div>';
            $("#warnDiv").append(line);
        }
        if(data['ship'] > 0){
            var line = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>提醒!</strong><a class="warnLink" id="ship"><strong>'+ data['ship'] +'</strong>个需要生成<strong>定舱资料</strong>的定单，在11天后截止，请核对定单</a></div>';
            $("#warnDiv").append(line);
        }
        if(data['custom'] > 0){
            var line = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>提醒!</strong><a class="warnLink" id="custom"><strong>'+ data['custom'] +'</strong>个需要生成<strong>报关资料</strong>的定单，在11-15天内到期，请核对定单</a></div>';
            $("#warnDiv").append(line);
        }
        if(data['buss'] > 0){
            var line = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>提醒!</strong><a class="warnLink" id="buss"><strong>'+ data['buss'] +'</strong>个需要生成<strong>商检资料</strong>的定单，在11-15天内到期，请核对定单</a></div>';
            $("#warnDiv").append(line);
        }
        if(data['inv'] > 0){
            var line = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>提醒!</strong><a class="invLink" href="./invAdmin.php?type=orderAdmin" id="inventory"><strong>'+ data['inv'] +'</strong>个定单在今天到期，请出库操作</a></div>';
            $("#warnDiv").append(line);
        }

        $(".warnLink").click(function(){
            warnSearch(1, $(this).attr("id"));
        });
    });

    $("#outputInvBtn").click(function(){
        var data = getInvData();
        if(confirm("确定进行出库？")){
            $.post(
                "./invInfo.php",
                {type:'invIn',inputType:'out',source:'orderAdmin',data:data},
                function(data){
                    //alert(data);
                    //$("#invOutput").append(data);
                }
            );
        }
    });

    $("#updateFacVoiceBtn").click(function(){
        $.get(
            "./factoryInvoiceResult.php",
            {type:'get',data:inputUpdate,signDate:'2014-01-01',transDate:$("#updateFacVoiceSignDate").val(),number:$("#updateFacVoiceNumber").val()},
            function(data){
                //alert(data);
                $("#updateFacVoiceLink").attr("href",data);
                $("#updateFacVoiceLink").removeAttr("hidden");
            }
        );
    });

    $("#updateCommPlanBtn").click(function(){
        $.get(
            "./diliverPlanInfo.php",
            {type:'get',data:inputUpdate},
            function(data){
                alert(data);
                $("#updataCommPlanLink").attr("href",data);
                $("#updataCommPlanLink").removeAttr("hidden");
            }
        );
    });

    $("#allSelected").click(function(){
        $(".orderInfoList").prop("checked",$(this).prop("checked"));
    });

    $('#orderlist').on('click', ".edit", function(){
        var data = $(this).closest('tr').data('info');
        $("#ECreateDate").val(data['O_CREATE_DATE']);
        $("#EPODate").val(data['O_DATE']);
        $("#EPONumber").val(data['O_PONumber']);
        $("#EKeycode").val(data['O_KEYCODE']);
        $("#ESYDNEY").val(data['O_SYDNEY']);
        $("#EMELBOURNE").val(data['O_MELBOURNE']);
        $("#EBRISBANE").val(data['O_BRISBANE']);
        $("#PERTH").val(data['O_PERTH']);
        $("#EAUCKLAND").val(data['O_AUCKLAND']);
        $("#ELYT").val(data['lyt']);
        $("#EDeliverDate").val(data['O_DELIVER_TIME']);
        editId = data['O_ID'];
        $("#editOrderModal").data('editId', data['O_ID']);
        $("#editOrderModal").modal("show");
    });

    $("#orderlist").on('click', '.deleteLink', function(){
        if(confirm('Are you sure to delete this order?')){
            var data = $(this).closest('tr').data('info'),
                id = data['O_ID'];
            OrderDAO.deleteOrder(id, function(){
                $("#searchButton").trigger('click');
            });
        }
    });

    $('#orderlist').on('change', ".done", function(){
        var value = $(this).val(),
            id = $(this).closest('tr').data('info')['O_ID'];
        $(this).closest('tr').css('background-color', value);
        OrderDAO.done(id, value, function(){
            alert("The order's status has been changed.");
        });
    });

    $('#orderlist').on('click', ".CRCLink", function(){
        var book = $(this).parent().prev().prev().prev();
        if(book.text() == "NULL"){
            if(confirm("还没有生成对应的定舱，是否先生成定舱?")){
                return;
            }
        }
        if(book.prev().text() == "NULL"){
            if(confirm("还没有生成对应的验货申请，是否先生成验货申请?")){
                return;
            }
        }
        $.getJSON(
            "./orderInfoList.php",
            {type:'crc',id:$(this).attr("id")},
            function(data){
                var line = '';
                for(var i = 0; i < data.length; i++){
                    line += ('<label class="checkbox"><input type="checkbox" class="orderInfoList" id=' + data[i]['O_ID'] +' value=' + data[i]['O_ID'] + ' />' + data[i]['O_PONumber'] + ' ' + data[i]['O_KEYCODE'] + ' ' + data[i]['O_DATE'] + '</label>');
                }

                $("#orderInfoListDiv").append(line);
                $("#uploadFileModal").modal("show");

                $("input[name='orderInfoList']").click(function(){
                    alert($(this).is(":checked"));
                });
            }
        );
    });

    $('#fileupload').fileupload({
        url: '/upload/index.php'
    }).bind('fileuploaddone', function (e, data){
        //$("#invOutputModal").showLoading();
        var result = JSON.parse(data.result),
            filename = "/upload/files/" + result.files[0].name;
        $.post(
            "/dataAdmin/fileUpload.php",
            {method: 'input', filename: filename},
            function(rsp){
                if(!rsp.success){
                    alert('ERROR:' + rsp.message);
                    return;
                }

                inputDataInit(rsp.data);
            },
            'json'
        );
    });

    $('#matchFileupload').fileupload({
        url: '/upload/index.php'
    }).bind('fileuploaddone', function (e, data){
        $("#matchModal").showLoading();
        var result = JSON.parse(data.result),
            filename = "/upload/files/" + result.files[0].name;
        $.post(
            "./orderExcel.php",
            {method: 'match', filename: filename},
            function(data){
                $("#matchModal").hodeLoading();

                $("#matchLink").attr("href", data);
                $("#matchLinkDiv").css("display", 'block');
            }
        );
    });
});

function inputDataInit(input){
    var line = "";
    if(input['newOrder'].length > 0){
        line += "New orders: <br />";
        for(var i = 0; i < input['newOrder'].length; i++){
            line += (input['newOrder'][i]['O_PONumber'] + " " +  input['newOrder'][i]['O_KEYCODE'] + " " +  input['newOrder'][i]['O_DATE'] + "<br />");
        }
    }
    if(input['updateOrder'].length > 0){
        line += "Update orders: <br />";
        for(var i = 0; i < input['updateOrder'].length; i++){
            line += (input['updateOrder'][i]['O_PONumber'] + " " +  input['updateOrder'][i]['O_KEYCODE'] + " " +  input['updateOrder'][i]['O_DATE'] + "<br />");
        }
    }
    if(input['wrongOrder'].length > 0){
        line += "Wrong orders: <br />";
        for(var i = 0; i < input['wrongOrder'].length; i++){
            line += (input['wrongOrder'][i]['O_PONumber'] + " " + input['wrongOrder'][i]['O_KEYCODE'] + " " + input['wrongOrder'][i]['O_DATE'] + "<br />");
        }
    }
    $("#updateInfo").append(line);
}

function getOptions(){
    var options = {};
    if($("#searchComm1").val() != ""){
        options.poNumber = $("#searchComm1").val();
    }
    if($("#searchComm2").val() != ""){
        options.select1 = $("#select1").val();
        options.keycode = $("#searchComm2").val();
        options.select2 = $("#select2").val();
    }
    if($("#searchComm3").val() !== ""){
        options.dateS = $("#searchComm3").val();
    } else {
        options.select2 = 'and';
        options.dateS = '2016-01-01';
    }
    if($("#searchComm3E").val() != ""){
        options.dateE = $("#searchComm3E").val();
    }
    if($("#searchComm4").val() != ""){
        options.select3 = $("#select3").val();
        options.ship = $("#searchComm4").val();
    }
    return options;
}

function warnSearch(pageIndex, tableId){
    OrderDAO.getWarnList(pageIndex, tableId, function(rsp){
        Pagination.refresh({page: pageIndex, size: 100, number: rsp.number});
        intoTable(rsp.data);
    });
}

function intoTable(infoList){
    var total = 0;
    $("#orderlist").find('tr').remove();
    var preNumber = (Pagination.option.page - 1) * Pagination.option.size;
    for(var i = 0; i < infoList.length; i++){
        var line="<tr>";
        if(power <= 2){
            var admin="<td><a class='edit' id='e" + infoList[i]['O_ID'] + "'>[Edit]</a>&nbsp<a class='deleteLink'>[Delete]</a>";
            admin += "&nbsp<select class='done' id=" + infoList[i]['O_ID'] + "><option value='#FFFFFF' class='white'>white</option><option value='#948A54' class='brown'>brown</option><option value='#538DD5' class='blue'>blue</option><option value='#95B3D7' class='cyan'>cyan</option><option value='#D59693' class='red'>red</option><option value='#C4D29B' class='green'>green</option><option value='#B1A0C3' class='purple'>purple</option><option value='#FAAF8F' class='orange'>orange</option></select></td>";
            line+=admin;
        }
        line += ("<td>" + (preNumber + i + 1) + "</td>");
        line += ("<td>" + infoList[i]['O_CREATE_DATE'] + "</td>");
        line += ("<td>" + infoList[i]['O_DATE'] + "</td>");
        line += ("<td>" + infoList[i]['O_PONumber'] + "</td>");
        line += ("<td><a class='keycodeLink' data-keycode='" + infoList[i]['O_KEYCODE'] +"'>" + infoList[i]['O_KEYCODE'] + "</a></td>");
        line += ("<td>" + infoList[i]['C_NAME_EN'] + "</td>");
        var totali = (parseInt(infoList[i]['O_SYDNEY']) + parseInt(infoList[i]['O_MELBOURNE']) + parseInt(infoList[i]['O_BRISBANE']) + parseInt(infoList[i]['O_PERTH']) + parseInt(infoList[i]['O_AUCKLAND']));
        total += totali;
        line += ("<td>" + totali + "</td>");
        line += ("<td>" + infoList[i]['O_SYDNEY'] + "</td>");
        line += ("<td>" + infoList[i]['O_MELBOURNE'] + "</td>");
        line += ("<td>" + infoList[i]['O_BRISBANE'] + "</td>");
        line += ("<td>" + infoList[i]['O_PERTH'] + "</td>");
        line += ("<td>" + infoList[i]['O_AUCKLAND'] + "</td>");
        line += ("<td>" + infoList[i]['lyt'] + "</td>");
        line += ("<td>" + infoList[i]['O_DELIVER_TIME'] + "</td>");
        line += ("<td>" + infoList[i]['O_BACH_CODE'] + "</td>");

        if(power < 4){
            if(infoList[i]['O_TABLE_FAC']=="NULL"){
                line += "<td><a href='factoryInvoice.php'><font color='red'>NULL</font></a></td>";
            }else{
                line += "<td><a href=" + infoList[i]['O_TABLE_FAC'] + ">" + infoList[i]['O_ID_FAC'] + "</a></td>";
            }
        }
        if(infoList[i]['O_TABLE_CHECK']=="NULL"){
            line += "<td><a href='inspectInvoice.php'><font color='red'>NULL</font></a></td>";
        }else{
            var file = '"' + infoList[i]['O_TABLE_CHECK'] + '"';
            line += '<td><a href=' + file + '>'+ infoList[i]['O_INSPECTION_DATE'] + "</a></td>";
        }
        if(power < 4){
            if(infoList[i]['O_TABLE_SHIP']=="NULL" || infoList[i]['O_ID_SHIP'] == ""){
                line += "<td><a href='factoryInvoice.php'><font color='red'>NULL</font></a></td>";
            }else{
                line += "<td><a href="+infoList[i]['O_TABLE_SHIP']+">" + infoList[i]['O_ID_SHIP'] + "</a></td>";
            }
            if(infoList[i]['O_TABLE_BUSS']=="NULL" || infoList[i]['O_ID_BUSS'] == ""){
                line += "<td><a href='commInfo.php'><font color='red'>NULL</font></a></td>";
            }else{
                line += "<td><a href="+infoList[i]['O_TABLE_BUSS']+">" + infoList[i]['O_ID_BUSS'] + "</a></td>";
            }
        }
        if(infoList[i]['O_TABLE_CUSTOM']=="NULL" || infoList[i]['O_ID_CUSTOM'] == ""){
            line += "<td><a href='customInfo.php'><font color='red'>NULL</font></a></td>";
        }else{
            line += "<td><a href="+infoList[i]['O_TABLE_CUSTOM']+">" + infoList[i]['O_ID_CUSTOM'] + "</a></td>";
        }
        if(infoList[i]['O_TABLE_CRC']=="NULL" || infoList[i]['O_ID_CRC'] == ""){
            line += "<td><a class='CRCLink' id=" +infoList[i]['O_ID'] + "><font color='red'>NULL</font></a></td>";
        }else if(infoList['O_ID_SHIP'] == ""){
            line += "<td><a id=" +infoList[i]['O_ID'] + " href=" + infoList[i]['O_TABLE_CRC'] + ">download</a></td>";
        }else{
            line += "<td><a class='NCRCLink' id=" +infoList[i]['O_ID'] + " href='download.php?type=dbs&ship=" + infoList[i]['O_ID_SHIP'] + "'>" + infoList[i]['O_ID_SHIP']+ "</a></td>";
        }
        if(infoList[i]['O_TABLE_PUSH']=="NULL" || infoList[i]['O_ID_PUSH'] == ""){
            line += "<td><a href='upload.php?Id=" + infoList[i]['O_ID'] + "&Type=2'><font color='red'>NULL</font></a></td>";
        }else{
            line += "<td><a href="+infoList[i]['O_TABLE_PUSH']+">download</a></td>";
        }
        if(power <= 2){
            if(infoList[i]['O_TABLE_VOICE']=="NULL" || infoList[i]['O_ID_VOICE'] == ""){
                line += "<td><a href='upload.php?Id=" + infoList[i]['O_ID'] + "&Type=3'><font color='red'>NULL</font></a></td>";
            }else{
                line += "<td><a href="+infoList[i]['O_TABLE_VOICE']+">" + infoList[i]['O_ID_VOICE'] + "</a></td>";
            }
        }

        line += "</tr>"
        $("#orderlist").append(line);
        $("#orderlist").children('tr:last').data('info', infoList[i]);
    }

    for(var i=0; i < infoList.length; i++){
        if(power <= 2){
            var index=0;
            for(var k=0; k < colorList.length;k++){
                if(infoList[i]['O_DONE']==colorList[k]){
                    index=k;
                    break;
                }
            }
            $("#" + infoList[i]['O_ID'] + " option:eq(" + index + ")").attr("selected","selected");
            $("#" + infoList[i]['O_ID'] + " option:eq(" + index + ")").closest('tr').css("background-color",colorList[index]);
        }
    }

    $("th#totalNumber").html(total);

    $("#orderlist").find('.keycodeLink').each(function(){
        var data = $(this).closest('tr').data('info'),
            keycode = data['O_KEYCODE'],
            date = data['O_DATE'],
            name = data['O_NAME_EN'],
            $link = $(this);
        OrderDAO.getProductInfo(keycode, date, function(infoList){
            var list = "<ul class='productInfo'>";
            for(var i = 0; i < infoList.length; i++){
                list += '<li>' + infoList[i]['P_LOCALCODE'] + " " + infoList[i]['P_NAME_KP'] + '</li>';
            }
            list += "</ul>";

            $link.popover({
                trigger: 'hover',
                content: list,
                title: name,
                html: true,
                placement: 'auto bottom'
            })
        });
    });
}

function deltr(dom){
    $(dom).closest('tr').nextAll('.orderList').each(function(){
        var $target = $(this).find('td:eq(0)'),
            index = Number($target.text());
        $(this).find('td:eq(0)').replaceWith("<td class='orderList'>" + (index - 1) + "</td>");
    });
    $(dom).closest('tr').remove();
    listNumber--;
}

function uploadFile(filename){
    var info = '';
    var index = 0;
    $(".orderInfoList").each(function(i){
        if($(this).is(":checked")){
            info += ($(this).attr("id") + '--');
        }
    });
    info = info.substr(0,info.length-2);
    $.get(
        "./orderInfoList.php",
        {type:'updateCRC',list:info,file:filename},
        function(data){
            alert(data);
        }
    );
}

function uploadMatchFile(filename){
    $.get(
        "./orderInfoList.php",
        {type:'match',file:filename},
        function(data){
            alert(data);
            $("#matchLink").attr("href",data);
            $("#matchLink").removeAttr("hidden");
        }
    );
}

function getInvData(){
    var data = '';
    $("#proOutList tr").each(function(){
        data += ($(this).children("td:eq(0)").text() + '--' + $(this).children("td:eq(1)").text() + '--' + $(this).children("td:eq(2)").text() + '--' + $(this).children("td:eq(4)").children("input").val() + '--' + $(this).children("td:eq(5)").children("input").val() + '#');
    });
    data = data.substr(0,data.length-1);
    return data;
}

var OrderDAO = {
    url: '/dataAdmin/orderDAO.php',
    getData: function(option){
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: OrderDAO.url,
            data: {method: 'queryList', options: JSON.stringify(option)} ,
            success: function(rsp){
                if(!rsp.success){
                    alert('查询数据失败:' + rsp.message);
                    return;
                }

                Pagination.refresh({page: option.page, size: option.size, number: rsp.number});
                intoTable(rsp.data);
            },
            error: function(jqXHR, status, errorThrown){
                alert('查询数据失败' + status + ":" + errorThrown);
            }
        });
    },
    getWarnList: function(index, id, callback){
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: OrderDAO.url,
            data: {method: 'warnList', index:index, id:id} ,
            success: function(rsp){
                if(!rsp.success){
                    alert('查询数据失败:' + rsp.message);
                    return;
                }

                callback(rsp);
            },
            error: function(jqXHR, status, errorThrown){
                alert('查询数据失败' + status + ":" + errorThrown);
            }
        });
    },
    getWarn: function(callback){
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: OrderDAO.url,
            data: {method: 'getWarn'} ,
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
    getCommList: function(callback){
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: OrderDAO.url,
            data: {method: 'getCommList'} ,
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
    addOrder: function(orderList, options, callback){
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: OrderDAO.url,
            data: $.extend({method: 'addOrder', data: JSON.stringify(orderList)}, options),
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
    editOrder: function(options, callback){
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: OrderDAO.url,
            data: {method: 'editOrder', options: JSON.stringify(options)},
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
    deleteOrder: function(id, callback){
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: OrderDAO.url,
            data: {method: 'deleteOrder', id: id},
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
    getProductInfo: function(keycode, date, callback){
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: OrderDAO.url,
            data: {method: 'getProductInfo', keycode: keycode, date: date},
            success: function(rsp){
                console.log(date);
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
    done: function(id, value, callback){
        $.ajax({
            method: 'POST',
            dataType: 'json',
            url: OrderDAO.url,
            data: {method: 'done', value: value, id: id},
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