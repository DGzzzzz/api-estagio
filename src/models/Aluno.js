import Sequelize, { Model } from 'sequelize'

class Aluno extends Model {
    static init(sequelize) {
        super.init(
            {
                user_id: Sequelize.INTEGER,
                nome: Sequelize.STRING,
                curso: Sequelize.STRING,
            },
            {
                sequelize,
                tableName: 'aluno',
            }
        )

        return this
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id' })
    }
}

export default Aluno
