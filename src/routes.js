import { Router } from "express"
import authMiddleware from "./middlewares/auth.js"
import roleMiddleware from "./middlewares/role.js"
import SessionController from "./controllers/SessionController.js"
import AlunoController from "./controllers/AlunoController.js"
import EmpresaController from "./controllers/EmpresaController.js"
import VagaController from "./controllers/VagaController.js"

const routes = new Router()

// Público
routes.post('/sessions', SessionController.store)
routes.post('/aluno', AlunoController.store)
routes.post('/empresa', EmpresaController.store)

// Protegido
routes.use(authMiddleware)

// Aluno
routes.get('/aluno', roleMiddleware('aluno'), AlunoController.show)
routes.put('/aluno', roleMiddleware('aluno'), AlunoController.update)
routes.get('/vagas', roleMiddleware('aluno'), VagaController.index)
routes.get('/vagas/:id', roleMiddleware('aluno'), VagaController.show)

// Empresa
routes.get('/empresa', roleMiddleware('empresa'), EmpresaController.show)
routes.put('/empresa', roleMiddleware('empresa'), EmpresaController.update)
routes.get('/empresa/vagas', roleMiddleware('empresa'), EmpresaController.vagas)
routes.post('/vagas', roleMiddleware('empresa'), VagaController.store)
routes.put('/vagas/:id', roleMiddleware('empresa'), VagaController.update)
routes.patch('/vagas/:id', roleMiddleware('empresa'), VagaController.partialUpdate)
routes.delete('/vagas/:id', roleMiddleware('empresa'), VagaController.destroy)

export default routes
