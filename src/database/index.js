import Sequelize from "sequelize"
import databaseConfig from "../config/database.js"
import User from "../models/User.js"
import Aluno from "../models/Aluno.js"
import Empresa from "../models/Empresa.js"
import Vaga from "../models/Vaga.js"

const models = [User, Aluno, Empresa, Vaga]

class Database {
    constructor() {
        this.init()
    }

    init() {
        this.connection = new Sequelize(databaseConfig)

        models
            .map(model => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models))
    }
}

export default new Database()
