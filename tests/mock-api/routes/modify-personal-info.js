module.exports = (app) => {
  app.post('/reqxml', (request, response) => {
    if (request.query.funcId === '560002') {
      return response.json({
        code: 1,
        msg: 'err',
      })
    }
    if (request.body) {
      response.json({
        code: 0,
        msg: 'ok',
      })
    } else {
      response.status(401).json({ message: 'not found' })
    }
  })
}
