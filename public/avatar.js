$(function() {
    window.TechRadar = window.TechRadar || {};

    /**
     * Make a call to retrieve an avatar
     *
     * @param username
     * @param callback
     */
    TechRadar.getAvatar = function (username, callback, errorCallback) {
        $.ajax({
            type: "GET",
            url: '/api/user/avatar?username=' + username,
            contentType: "application/json",
            complete: function (data) {
                var resp = JSON.parse(data.responseText);
                if (resp.success) {
                    callback(resp.result);
                }  else {
                    errorCallback(resp);
                }
            }
        });
    };

    /**
     * Populate a page of comments for a technology
     *
     * @param username
     * @param imgElement jquery DOM image element
     */
    TechRadar.setAvatar = function (username, imgElement) {
        TechRadar.getAvatar(username, function (data) {
            if(data) {
                imgElement.attr('src', 'data:image/png;base64,' + data);
            } else {
                imgElement.attr('src', '/default-avatar.jpg');
            }
        }, function (err) {
            alert('There was an error while retrieving avatars');
            imgElement.attr('src', '/default-avatar.jpg');
        });
    };
});