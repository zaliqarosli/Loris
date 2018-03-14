$(document).ready(
    function(){
        $("#btn_reject").click(
            function(){
                var userID = document.getElementById("UserID").value;
                var baseurl = loris.BaseURL;
                swal({
                    title: "Are you sure?",
                    text: "You are about to reject this user account.",
                    type: "warning",
                    showCancelButton: true,
                    closeOnConfirm: false
                },
                function(){
                    $.ajax(baseurl + '/user_accounts/ajax/rejectUser.php', {
                        type:'POST',
                        data: {identifier: userID},
                        success: function(data, textStatus){
                            location.href = baseurl+'/user_accounts/';
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            alert(textStatus, errorThrown);
                        }
                    });
                });
            });
    });
