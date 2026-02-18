import Dexie, { type EntityTable } from 'dexie'
import type { Thread } from '../types/types'

const db = new Dexie('C5HopperDB') as Dexie & {
  threads: EntityTable<Thread, 'id'>
}

db.version(1).stores({
  threads: 'id, createdAt, updatedAt'
})

export { db }
