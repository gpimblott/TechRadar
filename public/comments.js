$(function() {
    window.TechRadar = window.TechRadar || {};

    /**
     * Make a call to delete a comment
     *
     * @param commentId
     */
    TechRadar.deleteComment = function (commentId) {
        var r = confirm("Are you sure you want to delete this comment ?");
        if (r == false) {
            return;
        }

        $.ajax({
            type: "DELETE",
            url: '/api/comments',
            contentType: "application/json",
            data: JSON.stringify({id: [commentId]}),
            complete: function (result) {
                if (result.success) {
                    location.reload();
                } else {
                    alert("There was an error deleting comment :(");
                }
            }
        });
    };

    /**
     * Populate a page of comments for a technology
     *
     * @param technologyId
     * @param pageNumber
     */
    TechRadar.getComments = function (technologyId, pageNumber) {
        $.ajax({
            type: "GET",
            url: '/comments/'+ technologyId + '/' + pageNumber,
            contentType: "application/json",
            complete: function (result) {
                $('#commentContainer').html(result.responseText);
            }
        });
    };
});