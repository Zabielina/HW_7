
import dotenv from "dotenv";

import http from "http";
import fs from "fs";
import path from "path";

dotenv.config();
const server = http.createServer();

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jfif": "image/jfif",
};

function includeStaticFile(res, filePath, ext) {
  res.setHeader("Content-Type", mimeTypes[ext]);
  fs.readFile("./public/" + filePath, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      res.end(data);
    }
  });
}

server.on("request", (req, res) => {
  const url = req.url;
  console.log(url);
  switch (url) {
    case "/": {
      fs.readFile("./Form.html", (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.write(data);
        }
        res.end();
      });
      break;
    }
    case "/api/order": {
      if (req.method === "POST") {
        let bodyData = "";
        req.on("data", (chunk) => {
          bodyData += chunk;
        });
        req.on("end", () => {
          const data = JSON.parse(bodyData);
         

          const mailOptions = {
            from: "Ваша назва <your-email@gmail.com>",
            to: data.Email,
            subject: "Нове замовлення",
            text: `Ім'я: ${data.FirstName}\nПрізвище: ${data.LastName}\nНомер телефону: ${data.PhoneNumber}`
          };

         

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Помилка під час відправлення замовлення' }));
            } else {
              console.log('Email sent: ' + info.response);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Замовлення успішно оформлено' }));
            }
          });
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
      break;
    }
    default: {
      const extname = String(path.extname(url)).toLocaleLowerCase();
      if (extname in mimeTypes) {
        includeStaticFile(res, url, extname);
      } else {
        res.statusCode = 404;
        res.end();
      }
      break;
    }
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
