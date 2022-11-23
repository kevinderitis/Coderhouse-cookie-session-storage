const express = require('express')
const session = require('express-session')

const app = express()

app.use(session({
  secret: 'shhhhhhhhhhhhhhhhhhhhh',
  resave: false,
  saveUninitialized: false
}))

app.get('/', (req, res) => {
  res.send('Servidor express ok!')
})

let contador = 0
app.get('/sin-session', (req, res) => {
  res.json({ contador: ++contador })
})

app.get('/con-session', (req, res) => {
  showSession(req)
  if (!req.session.contador) {
    req.session.contador = 1
    req.session.username = req.query.nombre;
    req.session.admin = true
    res.send(`Bienvenido ${req.session.username}!`)
  } else {
    req.session.contador++
    res.send(`Hola ${req.session.username}!ha visitado el sitio ${req.session.contador} veces.`)
  }
})


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.json({ status: 'Logout ERROR', body: err })
    } else {
      res.send('Logout ok!')
    }
  })
})


const validateAdmin = (req, res, next) => {
  if(req.session.admin){
    next()
  }else{
    res.send({ status: 'Authorization error', description: 'No admin' })
  }
}

app.get('/info', validateAdmin, (req, res) => {
  showSession(req)
  res.send('Send info ok!')
})

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Servidor express escuchando en el puerto ${PORT}`)
})

function showSession(req) {
  console.log('------------ req.session -------------')
  console.log(req.session)

  console.log('----------- req.sessionID ------------')
  console.log(req.sessionID)

  console.log('----------- req.cookies ------------')
  console.log(req.cookies)

  console.log('---------- req.sessionStore ----------')
  console.log(req.sessionStore)
}