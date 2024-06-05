const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Role = require("../models/roles"); // Importujesz model roli

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        let role = await Role.findOne({ name: 'user' }); // Pobierz ID roli "user"
        if (!role) {
            // Jeśli rola "user" nie istnieje, możesz obsłużyć ten przypadek
            return res.status(500).send({ message: "Default role 'user' not found" });
        }

        const userExists = await User.findOne({ email: req.body.email });
        if (userExists)
            return res.status(409).send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            roles: [role._id] // Przypisz ID roli "user" do nowego użytkownika
        });
        await user.save();
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
