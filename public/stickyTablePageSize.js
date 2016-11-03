var page_size = 10; //Default size

if (Cookies.get('page_size') != null ) {
    page_size = Cookies.get('page_size');
}

// Set a cookie to remember the chosen number of records per page 
$(document).on('click', '.dropdown-menu', function() {
    var size_selected = $('.pagination-detail .page-size').text();
    if (Cookies.get('cookieconsent_dismissed') == 'yes') {
        Cookies.set('page_size', size_selected);
    }
}); 