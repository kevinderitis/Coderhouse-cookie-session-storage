const express = require('express')
const session = require('express-session')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(
  session({
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
  })
)


const getNombreSession = req => req.session.nombre ?? ''

const auth = (req, res, next) => {
  if (req.session.admin) {
    next()
  } else {
    res.send('No esta autorizado')
  }
}

const validateUser = (user, pass) => {
  let result = false;
  if(user == 'admin' && pass == 'admin') {
    result = true
  }

  return result;
}

app.get('/', (req, res) => {
  if (req.session.contador) {
    if (req.session.contador < 100) req.session.contador++
    res.send(
      `${getNombreSession(req)} visitaste la página ${
        req.session.contador
      } veces.`
    )
  } else {
    req.session.nombre = req.query.nombre
    req.session.contador = 1
    if(req.query.nombre == 'kevin'){
      req.session.admin = true
    }
    res.send(`Te damos la bienvenida ${getNombreSession(req)}`)
  }
})
app.get('/loginAdmin', (req, res) => {
  req.session.user = "kevin";
  req.session.admin = true;
  res.send('Admin Logueado');
})
app.get('/loginNoAdmin', (req, res) => {
  req.session.user = "Coder";
  req.session.admin = false;
  res.send('No Admin Logueado');
})
app.get('/ejemplo', auth , (req, res) => {
 res.send('esto lo ve el admin')
})

app.get('/olvidar', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.json({ error: 'olvidar', body: err })
    } else {
      res.send(`Hasta luego`)
    }
  })
})

app.post('/login', (req, res) => {
  const { user, password, mail } = req.body;
  if (validateUser(user, password)){
    req.session.user = user;
    req.session.admin = true;
    req.session.mail = mail;
    res.send('Login admin ok')
  }

  res.send('Login failed')
})

app.use('/datos', auth, (req, res) => {
  let datos = { user: req.session.user, mail: req.session.mail }
  res.send(datos)
} )

const PORT = 8080
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
server.on('error', error => console.log(`Error en servidor: ${error}`))
