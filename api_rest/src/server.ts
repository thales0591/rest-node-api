import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

const app = fastify()

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

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
