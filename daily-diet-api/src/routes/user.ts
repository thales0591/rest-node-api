import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function createUserRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const getLoginSchema = z.object({
      username: z.string(),
      password: z.string(),
    })

    const { username, password } = getLoginSchema.parse(request.body)

    const searchUserResponse = await knex('users')
      .where({
        name: username,
        password,
      })
      .first()

    if (!searchUserResponse) {
      return reply.status(404).send({ message: 'User not found.' })
    }

    reply.setCookie('sessionId', searchUserResponse.id)

    reply.status(200).send({ message: 'Successfully logged in.' })
  })

  app.post('/register', async (request, reply) => {
    const getRegisterSchema = z.object({
      username: z.string(),
      password: z.string(),
    })

    const { username, password } = getRegisterSchema.parse(request.body)

    const userAlredyCreatedResponse = await knex('users')
      .where('name', username)
      .first()

    if (userAlredyCreatedResponse) {
      return reply.status(409).send({
        message:
          'A user with this username already exists, please choose another one.',
      })
    }

    const userId = randomUUID()

    await knex('users').insert({
      id: userId,
      name: username,
      password,
    })

    reply.setCookie('session_id', userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    reply.status(201).send({ message: 'User created successfully.' })
  })
}
