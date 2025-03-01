import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const test = await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title: 'titulo teste',
        amount: 1000,
      })
      .returning('*')

    return test
  })
}
