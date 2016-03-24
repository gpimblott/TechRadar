var Routes = function () {
};

Routes.create = function (app) {

    /**
     * Home page with no parameters
     */
    app.get('/', function (req, res) {
        res.render('pages/index',
            {});
    });
}

module.exports = Routes;
