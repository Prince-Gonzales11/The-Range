import { describe, it, expect, beforeEach } from 'vitest'
import { PostGameSummary } from './components/PostGameSummary.js'

describe('PostGameSummary', () => {
  let summary
  beforeEach(() => {
    document.body.innerHTML = ''
    summary = new PostGameSummary()
  })

  it('renders overlay and hides by default', () => {
    const el = document.getElementById('postgame-overlay')
    expect(el).toBeTruthy()
    expect(el.style.display).toBe('none')
  })

  it('shows with stats and updates UI', () => {
    summary.show({
      reason: 'timer',
      score: 12,
      accuracy: 66.6,
      hits: 8,
      misses: 4,
      totalShots: 12,
      difficultyName: 'Beginner',
      achievements: ['Sharpshooter']
    })
    const score = document.getElementById('pg-score').textContent
    const acc = document.getElementById('pg-accuracy').textContent
    expect(score).toBe('12')
    expect(acc).toBe('67%')
    const title = document.getElementById('pg-title').textContent
    expect(title).toContain('Training Complete')
  })
})

