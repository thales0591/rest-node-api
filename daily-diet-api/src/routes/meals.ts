import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkUserIsLogged } from '../middlewares/check-user-is-logged'

export async function createMealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
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

  app.get(
    '/:id',
    {
      preHandler: [checkUserIsLogged],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const sessionId = request.cookies.sessionId

      const { id } = getMealParamsSchema.parse(request.params)

      const selectedMealResponse = await knex('meals').where('id', id).first()

      if (selectedMealResponse?.userId !== sessionId) {
        return reply
          .status(401)
          .send({ message: 'You do not have access to this meal.' })
      }

      if (!selectedMealResponse) {
        return reply.status(404).send({ message: 'Meal not found.' })
      }

      return reply.status(200).send(selectedMealResponse)
    },
  )

  app.post(
    '/',
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

      return reply.status(201).send({ message: 'Meal successfully added' })
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkUserIsLogged],
    },
    async (request, reply) => {
      const getMealAttributesSchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        createdAt: z.string().datetime().optional(),
        inDiet: z.boolean().optional(),
      })

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)
      const sessionId = request.cookies.sessionId

      const { name, description, createdAt, inDiet } =
        getMealAttributesSchema.parse(request.body)

      const selectedMealResponse = await knex('meals').where('id', id).first()

      if (selectedMealResponse?.userId !== sessionId) {
        return reply
          .status(401)
          .send({ message: 'You do not have access to this meal.' })
      }

      const updateMealResponse = await knex('meals')
        .update({
          name,
          description,
          created_at: createdAt,
          inDiet,
        })
        .where('id', id)

      if (!updateMealResponse) {
        return reply.status(404).send({ message: 'Meal not found.' })
      }

      return reply.status(201).send({ message: 'Meal successfully updated' })
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserIsLogged],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)
      const sessionId = request.cookies.sessionId

      const selectedMealResponse = await knex('meals').where('id', id).first()

      if (selectedMealResponse?.userId !== sessionId) {
        return reply
          .status(401)
          .send({ message: 'You do not have access to this meal.' })
      }

      const deletedMealResponse = await knex('meals').del().where('id', id)

      if (!deletedMealResponse) {
        return reply.status(404).send({ message: 'Meal not found.' })
      }

      return reply.status(200).send({ message: 'Meal successfully deleted' })
    },
  )
}
