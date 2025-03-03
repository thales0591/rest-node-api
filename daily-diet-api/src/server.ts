import fastify from 'fastify'

const app = fastify()

app.get('/teste', async () => {
  return 'ping pong'
})

await app.listen({port: 3333})