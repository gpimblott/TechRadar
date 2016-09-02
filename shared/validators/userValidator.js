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
    };

    exports.validateAvatar = function (file) {
        if(file.size > 1024 * 1024) {
            return { valid: false, message: "Avatar size must be below 1 MB" };
        }

        return { valid: true };
    };

    exports.validateUsername = function (username) {
        var usernameRegex = new RegExp('^[a-z0-9_-]{3,16}$');

        if(!usernameRegex.test(username)) {
            return { valid: false, message: "Username should consist of 3 to 16 lower case characters, digits, '_' and '-'" };
        }

        return { valid: true };
    };

    exports.validateEmail = function (email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(email && email.length > 100) {
            return { valid: false, message: "Email too long" };
        }

        if(!emailRegex.test(email)) {
            return { valid: false, message: "Not a valid email" };
        }

        return { valid: true };
    };

})(typeof exports === 'undefined'? this['UserValidator']={}: exports);