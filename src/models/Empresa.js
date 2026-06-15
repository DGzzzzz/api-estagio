import Sequelize, { Model } from 'sequelize'

class Empresa extends Model {
    static init(sequelize) {
        super.init(
            {
                user_id: Sequelize.INTEGER,
                nome: Sequelize.STRING,
                cnpj: Sequelize.STRING,
            },
            {
                sequelize,
                tableName: 'empresa',
            }
        )

        return this
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id' })
        this.hasMany(models.Vaga, { foreignKey: 'empresa_id' })
    }
}

export default Empresa
