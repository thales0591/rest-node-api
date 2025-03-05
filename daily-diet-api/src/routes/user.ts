import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkUserIsLogged } from '../middlewares/check-user-is-logged'

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

    return reply.status(200).send({ message: 'Successfully logged in.' })
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

    reply.setCookie('sessionId', userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return reply.status(201).send({ message: 'User created successfully.' })
  })

  app.get(
    '/analytics',
    {
      preHandler: [checkUserIsLogged],
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const totalMealsRegistered = await knex('meals')
        .count('*')
        .where('userId', sessionId)

      const totalMealsWithinDiet = await knex('meals').count().where({
        userId: sessionId,
        inDiet: true,
      })

      const totalMealsOutsideDiet = await knex('meals').count().where({
        userId: sessionId,
        inDiet: false,
      })

      const mealsInDietStreak = await knex('meals').where({
        userId: sessionId,
      })

      let bestDaysInStreak = 0
      let streakCounter = 0

      mealsInDietStreak.forEach((ref) => {
        streakCounter = ref.inDiet ? streakCounter + 1 : 0
        if (streakCounter > bestDaysInStreak) {
          bestDaysInStreak = streakCounter
        }
      })

      return reply.status(200).send({
        'Total number of meals registered': totalMealsRegistered[0]['count(*)'],
        'Total number of meals within the diet':
          totalMealsWithinDiet[0]['count(*)'],
        'Total number of meals outside the diet':
          totalMealsOutsideDiet[0]['count(*)'],
        'Best streak of meals within the diet': bestDaysInStreak,
      })
    },
  )
}
