(function(exports){

    exports.validateNewPassword = function (password, confirmPassword) {
        if(password && password.length < 8) {
            return { valid: false, message: "Password too short" };
        }

        if(password !== confirmPassword){
            return { valid: false, message: "Passwords do not match" };
        }

        return { valid: true };
    };

    exports.validateNewPasswordChange = function (password, confirmPassword, oldPassword) {
        if(password && !oldPassword){
            return { valid: false, message: "You must enter your old password in order to change it" };
        }

        return exports.validateNewPassword(password, confirmPassword);
    }

})(typeof exports === 'undefined'? this['UserValidator']={}: exports);