import Sequelize, { Model } from 'sequelize'

class Vaga extends Model {
    static init(sequelize) {
        super.init(
            {
                empresa_id: Sequelize.INTEGER,
                titulo: Sequelize.STRING,
                descricao: Sequelize.TEXT,
                area: Sequelize.STRING,
                preenchida: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
            },
            {
                sequelize,
                tableName: 'vaga',
            }
        )

        return this
    }

    static associate(models) {
        this.belongsTo(models.Empresa, { foreignKey: 'empresa_id' })
    }
}

export default Vaga
