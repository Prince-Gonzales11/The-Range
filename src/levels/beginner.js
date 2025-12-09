// Beginner difficulty settings

export const beginner = {
    name: 'Beginner',
    targetCount: 5, // how many targets
    targetSpeed: 0.05, // speed of targets
    targetSize: 4.0, // size multiplier
    gameTime: 90, // 1.5 minutes
    spawnRange: { x: 15, y: 5, z: 40 }, // spawn area dimensions
    color: 0x00ff00,
    description: 'Easy targets, more time',
    collisionDistance: 3.0, // More forgiving
    icon: '🟢',
    accelFactor: 0.2,
    wobbleAmp: 0.02,
    avoidanceRadius: 1.5,
    avoidanceStrength: 0.03
};
