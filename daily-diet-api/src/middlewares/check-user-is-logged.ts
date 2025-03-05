import { FastifyRequest, FastifyReply } from 'fastify'
import { knex } from '../database'

export async function checkUserIsLogged(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({ message: 'Log in before proceeding.' })
  }

  const searchUser = await knex('users')
    .where({
      id: sessionId,
    })
    .first()

  if (!searchUser) {
    return reply.status(401).send({ message: 'Log in before proceeding.' })
  }
}
