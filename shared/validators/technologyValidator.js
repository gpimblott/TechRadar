(function(exports){

    exports.validateTechnologyName = function (name) {
        if(name==undefined || name.length < 2 ) {
            return { valid: false, message: "Technology Name too short" };
        }

        if( name.length > 40) {
            return { valid: false, message: "Technology Name too long" };
        }

        var pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9 -]*$/;

        if(!pattern.test(name)) {
            return { valid: false, message: "Technology name must start with a character/digit"};
        }

        return { valid: true };
    };


    exports.validateTechnologyWebsite = function (name) {
        if(name==undefined || name.length < 4 ) {
            return { valid: false, message: "Technology website too short" };
        }

        if(name.length > 100) {
            return { valid: false, message: "Technology website too long" };
        }

        return { valid: true };
    };

    exports.validateTechnologyLicenceWebsite = function (link) {
        if(link && link.length < 4 && link.length !== 0) {
            return { valid: false, message: "Technology licence website link too short" };
        }

        if(link && link.length > 200) {
            return { valid: false, message: "Technology licence website link too long" };
        }

        return { valid: true };
    };


})(typeof exports === 'undefined'? this['TechnologyValidator']={}: exports);