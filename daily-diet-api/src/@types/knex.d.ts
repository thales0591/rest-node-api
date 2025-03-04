// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/tpyes/tables' {
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
      in_diet: boolean
      id: string
    }
  }
}
