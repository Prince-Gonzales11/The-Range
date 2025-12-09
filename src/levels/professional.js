// Professional difficulty settings
export const professional = {
    name: 'Professional',
    targetCount: 5,  // how many targets
    targetSpeed: 0.15, // speed of targets
    targetSize: 4.0, // size multiplier
    gameTime: 30, // 30 seconds
    spawnRange: { x: 40, y: 15, z: 100 }, // spawn area dimensions
    color: 0xff0000,
    description: 'Hardcore mode',
   collisionDistance: 3.0, // More forgiving
    icon: '🔴',
    accelFactor: 0.3,
    wobbleAmp: 0.03,
    avoidanceRadius: 2.0,
    avoidanceStrength: 0.05
};
