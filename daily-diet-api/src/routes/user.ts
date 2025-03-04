import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function createUserRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const createRegisterSchema = z.object({
      username: z.string(),
      password: z.string(),
    })

    const { username, password } = createRegisterSchema.parse(request.body)

    const userAlredyCreated = await knex('users')
      .where('name', username)
      .first()

    if (userAlredyCreated) {
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

    reply.status(201).send({ message: 'Usuário criado com sucesso!' })
  })
}
