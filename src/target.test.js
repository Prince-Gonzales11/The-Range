import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { Target } from './components/Target.js'
import { beginner } from './levels/beginner.js'

describe('Target physics and collision', () => {
  let scene
  let cameraPos

  beforeEach(() => {
    scene = { add: () => {}, remove: () => {} }
    cameraPos = new THREE.Vector3(0, 1.6, 0)
  })

  it('moves toward camera and reduces distance', () => {
    const t = new Target(scene, beginner)
    const d0 = t.mesh.position.distanceTo(cameraPos)
    for (let i = 0; i < 30; i++) t.update(cameraPos, beginner, [t])
    const d1 = t.mesh.position.distanceTo(cameraPos)
    expect(d1).toBeLessThan(d0)
  })

  it('detects collision within threshold', () => {
    const t = new Target(scene, beginner)
    t.mesh.position.set(0, 1.6, -1)
    const hit = t.checkCollision(cameraPos)
    expect(hit).toBe(true)
  })
})
