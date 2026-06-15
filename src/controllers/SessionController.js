import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authConfig from '../config/auth.js';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        const { id, role } = user;

        return res.json({
            user: { id, email, role },
            token: jwt.sign({ id, role }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
