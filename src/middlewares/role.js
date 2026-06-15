export default (...roles) => (req, res, next) => {
    if (!roles.includes(req.userRole)) {
        return res.status(403).json({ error: 'Acesso não autorizado.' })
    }
    return next()
}
