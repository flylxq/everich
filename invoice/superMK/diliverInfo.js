/**
 *
 */
$(function(){
    $("#startDate, #endDate").datepicker({
        dateFormat:"yy-mm-dd",
        gotoCurrent:true,
        defaultDate:0,
        showButtonPanel:false,
    });

    $("#diliverPlanBtn").click(function(){
        $("#diliverPlanModal").modal("show");
        $("#diliverPlanModal").showLoading();
        $.post(
            "./diliverPlanInfo.php",
            {sd:$("#startDate").val(),ed:$("#endDate").val()},
            function(data){
                $("#diliverPlanLink").attr('href',data);
                $("#diliverPlanModal").hideLoading();
            }
        );
    });
});