module.exports = (app) => {
  app.post('/api/test', (request, response) => {
    // 酌情使用以下四项
    // console.log(request.headers);
    // console.log(request.body);
    // console.log(request.query);
    // console.log(request.params);
    if (request.body) {
      response.json({
        code: 0,
        msg: 'ok',
      })
    } else {
      response.status(401).json({ message: 'not found' })
    }
  })

  app.get('/api/test', (request, response) => {
    if (request.headers.authorization) {
      response.json({
        code: 0,
        msg: 'ok',
      })
    } else {
      response.status(401).json({
        message:
          'The token is either invalid or has expired. Please log in again.',
      })
    }
  })
}
