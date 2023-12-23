import app from './app'

function start () {
  // app.ready().then(() => {
  //   app.io.on('connect', socket => console.info('Socket connected', socket.id))
  // })

  app.listen(3000)
}

start()

