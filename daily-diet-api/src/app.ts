import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { createUserRoutes } from './routes/user'
import { createMealsRoutes } from './routes/meals'

export const app = fastify()

app.register(cookie)

app.register(createUserRoutes)

app.register(createMealsRoutes, {
  prefix: '/meals',
})
