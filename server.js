require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Archivos estáticos (asegurate que index.html esté en /public)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Transporter con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Ruta del formulario
app.post('/contacto', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  try {
    await transporter.sendMail({
      from: `"Landing Valentina" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,                  // te llega a tus casillas
      replyTo: email,                           // si respondés, le responde al cliente
      subject: 'Nueva consulta desde la landing',
      text: `
Nombre: ${nombre}
Email: ${email}

Mensaje:
${mensaje}
      `,
    });

    // Pantalla de éxito
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

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
