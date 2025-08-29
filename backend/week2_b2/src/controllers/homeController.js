const getHomepage = async (req, res) => {
    return res.render('index.esj')
}

module.exports = {
    getHomepage,
}