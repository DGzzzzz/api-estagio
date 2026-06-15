import { Router } from "express"
import authMiddleware from "./middlewares/auth.js"
import UserController from "./controllers/UserController.js"
import SessionController from "./controllers/SessionController.js"


const routes = new Router()

routes.post('/user', UserController.store)
routes.post('/session', SessionController.store)

routes.use(authMiddleware)

routes.get('/users', UserController.index)
routes.get('/user', UserController.show)
routes.put('/user/:id', UserController.update)

export default routes