import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'

let users
let scores

beforeEach(() => {
  users = new Map()
  scores = new Map()
})

vi.mock('../server/db.js', () => ({
  initSchema: async () => {},
  getUserByUsername: async (username) => {
    const u = users.get(username)
    if (!u) return null
    return { id: u.id, first_name: u.firstName, last_name: u.lastName, username: u.username, password_hash: u.passwordHash }
  },
  createUser: async ({ firstName, lastName, username, passwordHash }) => {
    const id = users.size + 1
    const u = { id, firstName, lastName, username, passwordHash }
    users.set(username, u)
    return { id, first_name: firstName, last_name: lastName, username }
  },
  upsertBestScore: async (userId, username, mode, score) => {
    const key = `${userId}:${mode}`
    const prev = scores.get(key) || 0
    const best = Math.max(prev, score)
    scores.set(key, best)
    return { best_score: best }
  },
  getUserScores: async (userId) => {
    const m = { beginner: 0, intermediate: 0, professional: 0 }
    for (const [k, v] of scores.entries()) {
      const [uid, mode] = k.split(':')
      if (String(uid) === String(userId)) {
        const key = String(mode).toLowerCase()
        if (key in m) m[key] = v
      }
    }
    return m
  }
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: async () => 'hash',
    compare: async () => true
  }
}))

import { app } from '../server/index.js'

describe('Auth and scores API', () => {
  it('signup and login flow works', async () => {
    const signup = await request(app).post('/api/auth/signup').send({
      firstName: 'Test', lastName: 'User', username: 'testuser', password: 'Aa1!aaaa'
    })
    expect(signup.status).toBe(201)

    const login = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'Aa1!aaaa' })
    expect(login.status).toBe(200)
    const cookie = login.headers['set-cookie']?.[0]
    expect(cookie).toContain('auth_token')

    const agent = request.agent(app)
    const me = await agent.get('/api/auth/me').set('Cookie', cookie)
    expect(me.status).toBe(200)
    expect(me.body.user.username).toBe('testuser')
  })

  it('updates and gets scores', async () => {
    users.set('player', { id: 1, firstName: 'P', lastName: 'L', username: 'player', passwordHash: 'hash' })
    const login = await request(app).post('/api/auth/login').send({ username: 'player', password: 'pass' })
    const cookie = login.headers['set-cookie']?.[0]
    const agent = request.agent(app)
    const upd = await agent.post('/api/scores/update').set('Cookie', cookie).send({ mode: 'beginner', score: 5 })
    expect(upd.status).toBe(200)
    const meScores = await agent.get('/api/scores/me').set('Cookie', cookie)
    expect(meScores.status).toBe(200)
    expect(meScores.body.scores.beginner).toBe(5)
  })
})
