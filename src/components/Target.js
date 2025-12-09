/*
Summary

The Target class creates 3D target objects in the scene using Three.js, positions them randomly within a 
specified spawn range, moves them toward the player, applies rotation for visual effect, respawns them if 
they get too close or behind the player, and checks for collisions with the player.

Purpose
Its purpose is to represent and manage the behavior of each target in the shooting game, including spawning, 
movement, visual effects, and collision detection, allowing the game loop to interact with targets consistently 
based on the current difficulty level.
*/
import * as THREE from 'three';

export class Target {
    constructor(scene, levelConfig) {
        this.levelConfig = levelConfig;
        this.velocity = new THREE.Vector3();
        this.wobblePhase = Math.random() * Math.PI * 2;
        
        const geometry = new THREE.SphereGeometry(
            levelConfig.targetSize / 2, 
            32, 
            16
        );
        
        const material = new THREE.MeshStandardMaterial({ 
            color: levelConfig.color 
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.respawn(levelConfig);
        scene.add(this.mesh);
    }

    respawn(levelConfig) {
        const range = levelConfig.spawnRange;
        const x = (Math.random() - 0.5) * range.x * 1.8;
        const yMin = 0.8;
        const yMax = Math.max(3.5, range.y);
        const y = yMin + Math.random() * (yMax - yMin);
        const z = -10 - Math.random() * range.z;
        this.mesh.position.set(x, y, z);
        this.speed = levelConfig.targetSpeed;
        this.velocity.set((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, this.speed);
    }

    update(cameraPosition, levelConfig, neighbors = []) {
        const toCamera = new THREE.Vector3().subVectors(cameraPosition, this.mesh.position);
        const dir = toCamera.clone().normalize();
        const accelFactor = levelConfig.accelFactor ?? 0.2;
        const accel = dir.multiplyScalar(this.speed * accelFactor);
        this.velocity.add(accel);
        const maxSpeed = this.speed * 1.5;
        if (this.velocity.length() > maxSpeed) {
            this.velocity.setLength(maxSpeed);
        }
        const wobbleAmp = levelConfig.wobbleAmp ?? 0.02;
        const wobble = new THREE.Vector3(
            Math.sin(this.wobblePhase) * wobbleAmp,
            Math.cos(this.wobblePhase * 0.9) * wobbleAmp,
            0
        );
        this.wobblePhase += 0.03;
        const avoidR = levelConfig.avoidanceRadius ?? 1.5;
        const avoidS = levelConfig.avoidanceStrength ?? 0.05;
        const separation = new THREE.Vector3();
        for (const n of neighbors) {
            if (n === this) continue;
            const d = this.mesh.position.distanceTo(n.mesh.position);
            if (d < avoidR && d > 0.0001) {
                const away = new THREE.Vector3().subVectors(this.mesh.position, n.mesh.position).setLength(avoidS / d);
                separation.add(away);
            }
        }
        this.velocity.add(separation);
        this.mesh.position.add(this.velocity).add(wobble);
        this.mesh.rotation.x += 0.02;
        this.mesh.rotation.y += 0.02;
        const distance = this.mesh.position.distanceTo(cameraPosition);
        if (distance < 1.0 || this.mesh.position.z > 0) {
            this.respawn(levelConfig);
        }
    }

   checkCollision(cameraPosition) {
    const threshold = this.levelConfig.collisionDistance;
    const distance = this.mesh.position.distanceTo(cameraPosition);
   return distance < threshold;
}

 flashHit() {
    const m = this.mesh.material;
    const origColor = m.color.clone();
    m.emissive = new THREE.Color(0xffffff);
    m.emissiveIntensity = 1.0;
    this.mesh.scale.multiplyScalar(1.1);
    setTimeout(() => {
        m.emissiveIntensity = 0;
        m.color.copy(origColor);
        this.mesh.scale.set(1,1,1);
    }, 120);
 }
}
