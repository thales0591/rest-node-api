import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkUserIsLogged } from '../middlewares/check-user-is-logged'

export async function createMealsRoutes(app: FastifyInstance) {
  app.get(
    '/meals',
    {
      preHandler: [checkUserIsLogged],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId

      const userMealsResponse = await knex('meals')
        .where('userId', sessionId)
        .select('*')

      return userMealsResponse
    },
  )

  app.post(
    '/meals',
    {
      preHandler: [checkUserIsLogged],
    },
    async (request, reply) => {
      const getMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        created_at: z.string().optional(),
        inDiet: z.boolean(),
      })

      const { name, description, inDiet } = getMealSchema.parse(request.body)

      const sessionId = request.cookies.sessionId

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        inDiet,
        userId: sessionId,
      })

      reply.status(201).send({ message: 'Meal successfully added' })
    },
  )
}
