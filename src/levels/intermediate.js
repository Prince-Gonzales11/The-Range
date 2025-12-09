// Intermediate difficulty settings

export const intermediate = {
    name: 'Intermediate',
    targetCount: 5 , // how many targets
    targetSpeed: 0.10, // speed of targets
    targetSize: 4.0, // size multiplier
    gameTime: 60, // 1 minutes
    spawnRange: { x: 30, y: 10, z: 80 },
    color: 0xffa500,
    description: 'Moderate challenge',
    collisionDistance: 3.0, // More forgiving
    icon: '🟠',
    accelFactor: 0.25,
    wobbleAmp: 0.025,
    avoidanceRadius: 1.8,
    avoidanceStrength: 0.04
};
