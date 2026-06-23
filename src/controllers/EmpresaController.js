import * as Yup from 'yup'
import User from '../models/User.js'
import Empresa from '../models/Empresa.js'
import Vaga from '../models/Vaga.js'

class EmpresaController {
    async store(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().required().min(2),
            cnpj: Yup.string().required().length(14),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Dados inválidos.' })
        }

        const userExists = await User.findOne({ where: { email: req.body.email } })
        if (userExists) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' })
        }

        const cnpjExists = await Empresa.findOne({ where: { cnpj: req.body.cnpj } })
        if (cnpjExists) {
            return res.status(400).json({ error: 'CNPJ já cadastrado.' })
        }

        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            role: 'empresa',
        })

        const empresa = await Empresa.create({
            user_id: user.id,
            nome: req.body.nome,
            cnpj: req.body.cnpj,
        })

        return res.status(201).json({
            id: user.id,
            email: user.email,
            nome: empresa.nome,
            cnpj: empresa.cnpj,
        })
    }

    async show(req, res) {
        const empresa = await Empresa.findOne({
            where: { user_id: req.userId },
            attributes: ['nome', 'cnpj'],
            include: [{ model: User, attributes: ['email'] }],
        })

        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada.' })
        }

        return res.json(empresa)
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().min(2),
            email: Yup.string().email(),
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

        const { email, oldPassword, nome } = req.body

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

        const empresa = await Empresa.findOne({ where: { user_id: req.userId } })
        await empresa.update({ nome })

        return res.json({
            email: user.email,
            nome: empresa.nome,
            cnpj: empresa.cnpj,
        })
    }

    async vagas(req, res) {
        const empresa = await Empresa.findOne({ where: { user_id: req.userId } })
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada.' })
        }

        const vagas = await Vaga.findAll({
            where: { empresa_id: empresa.id },
            attributes: ['id', 'titulo', 'area', 'descricao', 'preenchida'],
        })

        return res.json(vagas)
    }
}

export default new EmpresaController()
