import * as Yup from 'yup'
import User from '../models/User.js'

class UserController {
    async index(req, res) {
        let users = await User.findAll({
            attributes: ["id", "nome", "email"]
        })

        return res.json(users)
    }

    async show(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required()
        })

        if (!(await schema.isValid(req.query))) {
            return res.status(400).json({ error: 'Schema is not valid.' })
        }

        const { email } = req.query

        let user = await User.findAll({
            where: { email },
            attributes: ["id", "nome", "email"]
        })

        return res.json(user)
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().required().min(2),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6)
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Schema is not valid.' })
        }

        const { email } = req.body

        let user = await User.findAll({
            where: { email }
        })

        if (!user || user.length == 0) {
            user = await User.create(req.body)
            return res.json({
                'id': user_id
            })
        }

        return res.status(400).json({ error: 'User already exists.' })
    }

    async update(req, res) {
        const schemaID = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await schemaID.isValid(req.params))) {
            return res.status(400).json({ error: 'Schema is not valid.' });
        }

        const schema = Yup.object().shape({
            nome: Yup.string().min(2),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('passwordAntigo', (passwordAntigo, field) =>
                    passwordAntigo ? field.required() : field
                ),
            passwordConfirma: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Schema is not valid.' });
        }

        const { id } = req.params
        const { nome, email } = req.body

        let user = await User.findByPk(id);

        //verifica se usuario existe
        if (!user || user.length == 0) {
            return res.status(400).json({ error: 'User not found.' });
        }

        //verifica email
        if (email !== user.email) {
            const userExists = await User.findOne({
                where: { email }
            })

            if (userExists) {
                return res.status(400).json({ error: 'User already exists.' });
            }
        }

        //verifica senha antiga
        const { oldPassword } = req.body

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match.' })
        }

        //atualiza o objeto 
        await user.update(req.body, {
            where: { id }
        })

        return res.json()
    }

    //destroy nao necessario
}

export default new UserController()