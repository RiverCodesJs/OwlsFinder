const forgotYourPassword = ({ token }) => ({
  subject: 'COBACHIH Plantel 8 - ¡Llegó tu momento de escoger!',
  // TODO: Change the href to a valid link
  emailContent: (
    `<html>
      <head>
        <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'>
        <style>
          body {
            font-family: 'Inter', sans-serif;
          }
          .container {
            padding: 2.5rem;
            width: auto;
            max-width: 500px;
            background-color: #4F0010;
            border-radius: 10px;
            margin: auto;
          }
          .content {
            text-align: center;
            background-color: #FCFCFC;
            padding: 5rem;
            border-radius: 10px;
          }
          .title {
            color: #000000f1;
            font-size: 32px;
            font-weight: 900;
          }
          .message {
            font-size: 16px;
            color: #000;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #E0E0E0;
            color: #000000f1;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <p class="title">Ingresa a la plataforma</p>
            <p class="message">Para poder hacer tu selección da clic en el botón de abajo.</p>
            <a href="${process.env.HOST ?? 'http://localhost:3000'}/forgot/${token}" class="btn">¡Aquí!</a>
          </div>
        </div>
      </body>
    </html>`
  )
})

export default forgotYourPassword