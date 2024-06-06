const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Pobranie tokenu z nagłówka
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" }); // Dodaj return
  }

  // Jeśli przesłano token - weryfikacja jego poprawności
  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodeduser) => {
    if (err) {
      console.log("Unauthorized!");
      return res.status(401).send({ message: "Unauthorized!" }); // Dodaj return
    }
    console.log("Token poprawny, użytkownik: " + decodeduser._id);
    req.user = decodeduser;
    next();
  });
}

module.exports = authMiddleware;