import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
import http from "http";
import fs from "fs";
import path from "path";
const server = http.createServer();
const PASS = "your password";
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
  switch (url) {
    case "/": {
      fs.readFile("./public/form.html", (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.write(data);
        }
        res.end();
      });
      break;
    }
    case "/api/message": {
      if (req.method === "POST") {
        let bodyData = "";
        req.on("data", (chunk) => {
          bodyData += chunk;
        });
        req.on("end", () => {
          const data = JSON.parse(bodyData);
          if (data.email && data.message) {
            let trans = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              auth: {
                user: "email",
                pass: PASS,
              },
              tls: {
                rejectUnauthorized: true,
                minVersion: "TLSv1.2",
              },
            });
            let mailOpt = {
              from: "Natalya Babenko <email>",
              to: data.email,
              subject: "New message",
              text: data.message,
            };
            let result = "";
            trans.sendMail(mailOpt, (err, info) => {
              console.log(err, info);
              if (err) {
                result = { status: "Error" };
              } else {
                {
                  result = { status: "OK" };
                }
              }
              res.write(JSON.stringify(result));
              res.end();
            });
          }
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
server.listen(process.env.PORT, () => {
  console.log(`Server start... ${process.env.host}:${process.env.PORT}:`);
});