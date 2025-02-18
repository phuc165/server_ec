class BlogController {
    // GET /blog
    index(req, res) {
        res.render('home');
    }

}

export default new BlogController();
