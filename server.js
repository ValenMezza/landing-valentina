require('dotenv').config();
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

const express = require('express');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Archivos estáticos (asegurate que index.html esté en /public)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Ruta del formulario
app.post('/contacto', async (req, res) => {
    const { nombre, email, mensaje } = req.body;

    try {
        const data = await resend.emails.send({
            from: "Contacto Landing <onboarding@resend.dev>",
            to: process.env.MAIL_TO,
            reply_to: email,
            subject: "Nueva consulta desde la Landing Page",
            text: `
Nombre: ${nombre}
Email: ${email}

Mensaje:
${mensaje}
            `
        });

        console.log("Correo enviado con Resend:", data);

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
        console.error("Error al enviar correo con Resend:", error);

        res.status(500).send(`
            <html>
                <head><meta charset="utf-8" /><title>Error</title></head>
                <body>
                    <h1>Error al enviar el mensaje</h1>
                    <p>Intentá nuevamente más tarde.</p>
                </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
