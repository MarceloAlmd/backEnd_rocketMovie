const {hash, compare} = require("bcryptjs");
const sqliteConnection = require("../database/sqlite")
const AppError = require("../utils/AppError")

class UserController {
    async create(request, response) {
        const {name, email, password} = request.body;
        const database = await sqliteConnection();

        const checkEmailExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]); 
        if(checkEmailExists) {
            throw new AppError("this email is already in use!")
        }
        const passwordHash = await hash(password, 8);

        await database.run(
            "INSERT INTO users (name, email, password) VALUES(?, ?, ?)",
            [name, email, passwordHash]
        )
        
        return response.status(201).json({
            message: "Usuário criado com sucesso"
        });
        
    }

    async update(request, response) {
        const {name, email, old_password, new_password} = request.body
        const {id} = request.params;

        const database = await sqliteConnection();
        
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        if(!user) {
            throw new AppError("user not found!");
        };

        const checkEmailUpdated = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkEmailUpdated && checkEmailUpdated.id !== user.id) {
            throw new AppError("this email is already being used by another user");
        };

        if(new_password && !old_password) {
            throw new AppError("Enter old password to update new password")
        };

        if(!new_password && old_password) {
            throw new AppError("inform the new password")
        }

        if(new_password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)
            if(!checkOldPassword) {
                throw new AppError("old password does not match");
            };

            user.password = await hash(new_password, 8)
        };

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user.id]
        );
        return response.json({
            message: "Usuário atualizado com sucesso"
        })

    };

    async delete(request, response) {
        const {id} = request.params;
        const database = await sqliteConnection();

        const userExists = await database.get("SELECT * FROM users WHERE id = (?)", [id]);
        if(!userExists) {
            throw new AppError("user not found!")
        };

        await database.run("DELETE FROM users WHERE id = (?)", [id])

        return response.json({
            message: "Usuário deletado com sucesso"
        })
    }
};

module.exports = UserController;

