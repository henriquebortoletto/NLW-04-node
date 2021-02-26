import { Router } from 'express'

import { UserController } from './controllers/UserController'
import { SurveysController } from './controllers/SurveyController'
import { SendMailController } from './controllers/SendMailController'

const router = Router()

const userController = new UserController()
const surveysController = new SurveysController()
const sendMailController = new SendMailController()

router.post('/users', userController.create)
router.get('/surveys', surveysController.show)
router.post('/surveys', surveysController.create)
router.post('/sendMail', sendMailController.execute)

export { router }
