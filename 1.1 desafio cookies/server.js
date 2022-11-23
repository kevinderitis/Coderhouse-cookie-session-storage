const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser(['montoto', 'pepito', 'coder']))

app.use(express.json())

app.post('/cookies', (req, res) => {
  const { nombre, valor, tiempo } = req.body
  console.log(nombre, valor, tiempo)

  if (!nombre || !valor) {
    return res.json({ error: 'falta nombre ó valor' })
  }

  if (tiempo) {
    let msTime = 1000 * parseInt(tiempo);
    res.cookie(nombre, valor, { signed: true, maxAge: msTime  })
  } else {
    res.cookie(nombre, valor, { signed: true })
  }
  res.json({ proceso: 'ok' })
})

app.get('/cookies', (req, res) => {
  console.log(req.cookies)
  res.json({ normales: req.cookies, firmadas: req.signedCookies })
})

app.delete('/cookies/:nombre', (req, res) => {
  const { nombre } = req.params
  console.log(req.cookies[nombre])
  console.log(req.signedCookies[nombre])
  if (!req.cookies[nombre] && !req.signedCookies[nombre]) {
    res.json({ error: 'nombre de cookie invalido' })
  } else {
    res.clearCookie(nombre)
    res.json({ proceso: 'ok' })
  }
})

app.get('/cookies/:nombre', (req, res) => {
  const { nombre } = req.params
  let nom = req.cookies[nombre];
  console.log(nom)
    res.json({ proceso: nom })

});

app.get('/signedCookies/:nombre', (req, res) => {
  const { nombre } = req.params
  let nom = req.signedCookies[nombre];
  console.log(nom)
    res.json({ proceso: nom })

});


const PORT = 8080
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
server.on('error', error => console.log(`Error en servidor: ${error}`))
