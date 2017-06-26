/**
 * Created by flylxq on 24/06/2017.
 */
$(function(){
    DAO.getShipInfo(function(data){
        var list = [];
        for(var i = 0; i < data.length; i++){
            list.push(data[i]['B_SHIP_ID']);
        }
        $("#shipNumber").autocomplete({
            source: list
        });
    });

    $('#invoiceDate').datepicker({
        inline:true,
        dateFormat:"yy-mm-dd",
        gotoCurrent:true,
        defaultDate:0,
    });

    $('#output-btn').click(function(e){
        var shipNumber = $("#shipNumber").val().trim(),
            invoiceCode = $('#invoiceCode').val().trim(),
            invoiceDate = $('#invoiceDate').val().trim();
        if(shipNumber === ""){
            alert("Please input the ship number!");
            return;
        }
        if(invoiceCode === "") {
            alert('Please input the invoice number!');
            return;
        }
        if(invoiceDate === "") {
            alert('Please inpjut the invoice date!');
            return;
        }

        if(!confirm("确定生成原产地证？")){
            return;
        }

        var $modal = $("#orgin-cert-modal");
        $modal.modal("show");
        $modal.showLoading();
        $.post(
            './originCertificateResult.php',
            {
                shipNumber: shipNumber,
                invoiceCode: invoiceCode,
                invoiceDate: invoiceDate
            },
            function(data) {
                //$("#orgin-cert-ink").text(data);
                $("#orgin-cert-ink").attr("href",data);
                $modal.hideLoading();
            }
        )
    });
})

var DAO = {
    url: '/dataAdmin/shipInfoServer.php',
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
    }
}