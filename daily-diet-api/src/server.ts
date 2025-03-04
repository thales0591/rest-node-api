import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { createUserRoutes } from './routes/user'

const app = fastify()

app.register(cookie)

app.register(createUserRoutes)

app.listen({ port: 3333 }).then(() => console.log('HTTP Server Running!'))
