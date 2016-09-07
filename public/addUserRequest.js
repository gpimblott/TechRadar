$( "form" ).submit(function(event) {
    var username = $("form [name=username]").val();
    var email = $("form [name=email]").val();
    var password1 = $("form [name=password]").val();
    var password2 = $("form [name=password2]").val();

    var thisScript = document.getElementById('addUserRequest');
    var requestUrl = thisScript.getAttribute('request-url');
    var redirectSuccessUrl = thisScript.getAttribute('redirect-success-url');

    var validationResult = UserValidator.validateNewPassword(password1, password2);
    validationResult = validationResult.valid ? UserValidator.validateUsername(username) : validationResult;
    validationResult = validationResult.valid ? UserValidator.validateEmail(email) : validationResult;
    if(!validationResult.valid) {
        alert(validationResult.message);
        return;
    }

    $(":submit").attr("disabled", true);
    var frm = $('form');
    var frmdata = serialiseForm(frm);

    $.ajax({
        type: "POST",
        url: requestUrl,
        contentType: "application/json",
        data: JSON.stringify(frmdata),
        success: function(result) {
            if( result.success) {
                location.href = redirectSuccessUrl;
            } else {
                alert(`The registration process is not working. 
                    Please contact the administrator.`);
            }
            $(":submit").attr("disabled", false);
        }
    });

    if(typeof ga !== 'undefined'){
        ga('send', 'event', 'User', 'SignUp', frm.find('input[name="username"]').val() );
    }
});