const home = (req, res) => {
  res.status(200).render('/home/index');
};

module.exports = { home };