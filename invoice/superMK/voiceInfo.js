/**
 *
 */
$(function(){
    voiceInfoDAO.getShipList(function(data){
        var list = [];
        for(var i = 0; i < data.length; i++){
            list.push(data[i]['B_SHIP_ID']);
        }

        $("#shipNumber").autocomplete({
            minLength:0,
            source: list
        });
    });

    $("#signDate").datepicker({
        dateFormat:"yy.mm.dd",
        gotoCurrent:true,
        defaultDate:0,
        showButtonPanel:true
    });

    $("#voiceInfoBtn").click(function(){
        var shipNumber = $("#shipNumber").val();
        if(shipNumber == ""){
            alert('请输入运编号!');
            return;
        }
        var signDate = $("#signDate").val();
        $("#voiceInfoModal").modal("show");
        $("#voiceInfoModal").showLoading();
        $.get(
            "./voiceInfoResult.php",
            {shipNumber:shipNumber,signDate:signDate},
            function(data){
                $("#voiceInfoLink").attr("href",data);
                $("#voiceInfoModal").hideLoading();
            }
        );
    });
});

var voiceInfoDAO = {
    getShipList: function(callback){
        $.ajax({
            url: '/dataAdmin/commInfoServer.php',
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