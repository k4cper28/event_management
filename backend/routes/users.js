const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Role = require("../models/roles"); // Importujesz model roli
const authMiddleware = require('../middleware/authMiddleware');

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

// GET: Retrieve all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords from the response
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// GET: Retrieve a user by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Exclude password from the response
        if (!user)
            return res.status(404).send({ message: "User not found" });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// PATCH: Update a user by ID
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const { error } = validate(req.body, true); // Assume the validate function has a partial validation option
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).send({ message: "User not found" });

        if (req.body.password) {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        Object.assign(user, req.body);
        await user.save();

        res.status(200).send({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// DELETE: Delete a user by ID
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).send({ message: "User not found" });
        
        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
