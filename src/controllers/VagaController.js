import * as Yup from 'yup'
import Vaga from '../models/Vaga.js'
import Empresa from '../models/Empresa.js'

class VagaController {
    async index(req, res) {
        const vagas = await Vaga.findAll({
            where: { preenchida: false },
            attributes: ['id', 'titulo', 'area', 'preenchida'],
            include: [{ model: Empresa, attributes: ['nome'] }],
        })

        return res.json(vagas)
    }

    async show(req, res) {
        const vaga = await Vaga.findByPk(req.params.id, {
            include: [{ model: Empresa, attributes: ['nome', 'cnpj'] }],
        })

        if (!vaga) {
            return res.status(404).json({ error: 'Vaga não encontrada.' })
        }

        return res.json(vaga)
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            titulo: Yup.string().required(),
            descricao: Yup.string().required(),
            area: Yup.string().required(),
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Dados inválidos.' })
        }

        const empresa = await Empresa.findOne({ where: { user_id: req.userId } })
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada.' })
        }

        const vaga = await Vaga.create({
            empresa_id: empresa.id,
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            area: req.body.area,
        })

        return res.status(201).json(vaga)
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            titulo: Yup.string(),
            descricao: Yup.string(),
            area: Yup.string(),
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Dados inválidos.' })
        }

        const empresa = await Empresa.findOne({ where: { user_id: req.userId } })
        const vaga = await Vaga.findOne({
            where: { id: req.params.id, empresa_id: empresa.id },
        })

        if (!vaga) {
            return res.status(404).json({ error: 'Vaga não encontrada.' })
        }

        await vaga.update(req.body)

        return res.json(vaga)
    }

    async preencher(req, res) {
        const empresa = await Empresa.findOne({ where: { user_id: req.userId } })
        const vaga = await Vaga.findOne({
            where: { id: req.params.id, empresa_id: empresa.id },
        })

        if (!vaga) {
            return res.status(404).json({ error: 'Vaga não encontrada.' })
        }

        await vaga.update({ preenchida: true })

        return res.json(vaga)
    }

    async destroy(req, res) {
        const empresa = await Empresa.findOne({ where: { user_id: req.userId } })
        const vaga = await Vaga.findOne({
            where: { id: req.params.id, empresa_id: empresa.id },
        })

        if (!vaga) {
            return res.status(404).json({ error: 'Vaga não encontrada.' })
        }

        await vaga.destroy()

        return res.status(204).send()
    }
}

export default new VagaController()
