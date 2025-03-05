// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      password: string
    }

    meals: {
      name: string
      description: string
      created_at: string
      inDiet: boolean
      id: string
      userId: string
    }
  }
}
