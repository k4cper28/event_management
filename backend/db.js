const mongoose = require("mongoose");
const Role = require("./models/roles"); // Zakładam, że masz oddzielny plik Role.js

const initializeRoles = async () => {
    const roles = ['admin', 'user']; // Lista ról, które chcesz dodać
    for (const roleName of roles) {
        const roleExists = await Role.findOne({ name: roleName });
        if (!roleExists) {
            const newRole = new Role({ name: roleName });
            await newRole.save();
            console.log(`Role '${roleName}' created.`);
        }
    }
};

module.exports = async () => {
    const connectionParams = {
    };
    
    try {
        await mongoose.connect(process.env.Mongo_URI, connectionParams);
        console.log("Connected to database successfully");
        await initializeRoles(); // Wywołaj funkcję inicjalizującą role po połączeniu
    } catch (error) {
        console.error("Could not connect to database:", error);
    }
};
