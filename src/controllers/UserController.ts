import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import * as yup from 'yup'

import { UsersRepository } from '../repositories/UsersRepository'
import { AppError } from '../errors/AppError'

class UserController {
	async create(request: Request, response: Response) {
		const { name, email } = request.body

		const schema = yup.object().shape({
			name: yup.string().required(),
			email: yup.string().email().required(),
		})

		try {
			await schema.validate(request.body, { abortEarly: false })
		} catch (error) {
			throw new AppError(error)
		}

		const usersRepository = getCustomRepository(UsersRepository)
		const userAlreadyExists = await usersRepository.findOne({ email })

		if (userAlreadyExists) {
			throw new AppError('User already exists!')
		}

		const user = usersRepository.create({ name, email })
		await usersRepository.save(user)

		return response.status(201).json(user)
	}
}

export { UserController }
