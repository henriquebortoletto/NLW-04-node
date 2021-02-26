import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { UsersRepository } from '../repositories/UsersRepository'
import { SurveysRepository } from '../repositories/SurveysRespository'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'
import SendMailServices from '../services/SendMailServices'

class SendMailController {
	async execute(request: Request, response: Response) {
		const { email, survey_id } = request.body

		console.log(email, survey_id)

		const usersRepository = getCustomRepository(UsersRepository)
		const surveyRepository = getCustomRepository(SurveysRepository)
		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

		const userAlreadyExists = await usersRepository.findOne({ email })

		if (!userAlreadyExists)
			return response.status(400).json({ error: 'User does not exists' })

		const survey = await surveyRepository.findOne({
			id: survey_id,
		})

		if (!survey)
			return response.status(400).json({ error: 'Survey does not exists!' })

		const surveyUser = surveysUsersRepository.create({
			user_id: userAlreadyExists.id,
			survey_id,
		})

		await surveysUsersRepository.save(surveyUser)

		await SendMailServices.execute(email, survey.title, survey.description)

		return response.json(surveyUser)
	}
}

export { SendMailController }