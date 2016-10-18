(function(exports){

    exports.validateProjectName = function (name) {
        if(name==undefined || name.length < 4 ) {
            return { valid: false, message: "Project Name too short" };
        }

        if( name.length > 100) {
            return { valid: false, message: "Project Name too long" };
        }

        var pattern =  /[A-Za-z0-9][A-Za-z0-9 -]*$/
        if(!pattern.test(name)) {
            return { valid: false, message: "Project name must start with a character"};
        }

        return { valid: true };
    };


})(typeof exports === 'undefined'? this['ProjectValidator']={}: exports);