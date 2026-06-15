import * as Yup from 'yup'
import User from '../models/User.js'
import Aluno from '../models/Aluno.js'

class AlunoController {
    async store(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().required().min(2),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            curso: Yup.string(),
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Dados inválidos.' })
        }

        const userExists = await User.findOne({ where: { email: req.body.email } })
        if (userExists) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' })
        }

        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            role: 'aluno',
        })

        const aluno = await Aluno.create({
            user_id: user.id,
            nome: req.body.nome,
            curso: req.body.curso || null,
        })

        return res.status(201).json({
            id: user.id,
            email: user.email,
            nome: aluno.nome,
            curso: aluno.curso,
        })
    }

    async show(req, res) {
        const aluno = await Aluno.findOne({
            where: { user_id: req.userId },
            attributes: ['nome', 'curso'],
            include: [{ model: User, attributes: ['email'] }],
        })

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado.' })
        }

        return res.json(aluno)
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().min(2),
            email: Yup.string().email(),
            curso: Yup.string(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
            ),
            passwordConfirma: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Dados inválidos.' })
        }

        const user = await User.findByPk(req.userId)
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' })
        }

        const { email, oldPassword, nome, curso } = req.body

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email } })
            if (emailExists) {
                return res.status(400).json({ error: 'E-mail já cadastrado.' })
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Senha incorreta.' })
        }

        await user.update({ email, password: req.body.password })

        const aluno = await Aluno.findOne({ where: { user_id: req.userId } })
        await aluno.update({ nome, curso })

        return res.json({
            email: user.email,
            nome: aluno.nome,
            curso: aluno.curso,
        })
    }
}

export default new AlunoController()
