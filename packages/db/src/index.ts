export * from './schema/users'
export * from './schema/permohonan'
export * from './schema/riwayat'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as usersSchema from './schema/users'
import * as permohonanSchema from './schema/permohonan'
import * as riwayatSchema from './schema/riwayat'

const schema = { ...usersSchema, ...permohonanSchema, ...riwayatSchema }

const connectionString = process.env.DATABASE_URL!

/** Singleton DB client — import this in server code */
const client = postgres(connectionString)
export const db = drizzle(client, { schema })
