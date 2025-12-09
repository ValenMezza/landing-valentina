// Cargar variables de entorno desde .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
//   CONFIG BÁSICA
// =======================

// Servir archivos estáticos (index.html, styles.css, etc.)
// Asegurate de que tu index.html esté en:  /public/index.html
app.use(express.static(path.join(__dirname, 'public')));

// Para leer datos de formularios (POST x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// =======================
//   TRANSPORTER GMAIL
// =======================

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // ej: mezza12354@gmail.com
    pass: process.env.MAIL_PASS, // contraseña de aplicación de Gmail
  },
});

// (Opcional, pero útil) Log rápido para verificar env cargadas
console.log('MAIL_USER:', process.env.MAIL_USER);
console.log('MAIL_TO:', process.env.MAIL_TO);

// =======================
//   RUTAS
// =======================

// Ruta raíz (por si Render o alguien pega / directamente)
// Aunque con express.static ya debería servir index.html, esto asegura:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta del formulario de contacto
app.post('/contacto', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  try {
    await transporter.sendMail({
      from: `"Landing Valentina" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,   // una o varias casillas tuyas
      replyTo: email,            // si respondés, le contestás al cliente
      subject: 'Landing Valentina - Nuevo mensaje de contacto',
      text: `
Nombre: ${nombre}
Email: ${email}

Mensaje:
${mensaje}
      `,
    });

    // Pantalla de éxito con redirección a la home
    res.send(`
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Mensaje enviado</title>
          <meta http-equiv="refresh" content="3; url=/" />
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              background: #f8fafc;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .card {
              background: #fff;
              padding: 2rem 2.5rem;
              border-radius: 1rem;
              box-shadow: 0 10px 30px rgba(15,23,42,0.08);
              text-align: center;
            }
            h1 {
              font-size: 1.4rem;
              margin-bottom: .5rem;
            }
            p {
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>¡Gracias por tu mensaje!</h1>
            <p>Tu consulta fue enviada correctamente. Serás redirigido a la página principal.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error al enviar el correo:', error);

    res.status(500).send(`
      <html>
        <head><meta charset="utf-8" /><title>Error</title></head>
        <body>
          <h1>Ocurrió un error al enviar el mensaje.</h1>
          <p>Por favor, vuelve a intentarlo más tarde.</p>
        </body>
      </html>
    `);
  }
});

// (Opcional) Ruta de test para probar el mail sin usar el form
// Ir a: http://localhost:3000/test-email
app.get('/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Test Landing" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: 'Test de correo desde Nodemailer',
      text: 'Hola, este es un test de tu landing de Valentina Dagum.',
    });

    res.send('Test enviado, revisá tu casilla 🙂');
  } catch (error) {
    console.error('Error en /test-email:', error);
    res.status(500).send('Error enviando el test, mirá la consola.');
  }
});

// =======================
//   LEVANTAR SERVIDOR
// =======================

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
