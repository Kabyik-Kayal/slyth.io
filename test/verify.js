// Verification test suite for game logic, physics, spatial grid, and bots
import { CONFIG, SKINS } from '../js/config.js';
import { SpatialGrid } from '../js/spatialGrid.js';
import { FoodManager } from '../js/food.js';
import { Snake } from '../js/snake.js';
import { BotSnake } from '../js/bot.js';
import { ParticleManager } from '../js/particle.js';
import { escapeHTML } from '../js/ui.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- Running Slyth.io Logic Verification ---');

// 1. Verify Spatial Grid
const grid = new SpatialGrid(CONFIG.SPATIAL_CELL_SIZE);
const entity1 = { x: 100, y: 100, radius: 15, id: 'e1' };
const entity2 = { x: 120, y: 100, radius: 10, id: 'e2' };
const entity3 = { x: 1000, y: 1000, radius: 10, id: 'e3' };

grid.insert(entity1);
grid.insert(entity2);
grid.insert(entity3);

const circleHits = grid.queryCircle(100, 100, 25);
assert(circleHits.length >= 2, 'SpatialGrid circle query found nearby entities');

const rectHits = grid.queryRect(80, 80, 150, 150);
assert(rectHits.length >= 2, 'SpatialGrid rect query found entities in bounding box');

// 2. Verify Snake Creation and Physics
const snake = new Snake('p1', 'Tester', 0, 0, 'neon-cyan', true);
assert(snake.segments.length > 15, 'Snake initializes with proper segments count');
assert(snake.mass === CONFIG.START_MASS, 'Snake starts with configured starting mass');

const initialLength = snake.segments.length;
const initialRadius = snake.radius;

// Simulate natural forward movement and growth
snake.mass += 50;
const particles = new ParticleManager();
const foodGrid = new SpatialGrid();
const foodMgr = new FoodManager(foodGrid, particles);
for (let i = 0; i < 10; i++) {
  snake.update(0.016, foodMgr, particles, null);
}

assert(snake.segments.length > initialLength, 'Snake grows segments when mass increases');
assert(snake.radius > initialRadius, 'Snake radius increases when mass increases');

// 3. Verify Boost Mechanic
snake.isBoosting = true;
const massBeforeBoost = snake.mass;
snake.update(0.1, foodMgr, particles, null);
assert(snake.speed > CONFIG.BASE_SPEED, 'Boosting increases snake speed');
assert(snake.mass < massBeforeBoost, 'Boosting consumes mass over time');

// 4. Verify AI Bot Logic & Avoidance
const bot = new BotSnake('b1', 'BotTest', 100, 100, 'magma-fire', 'HUNTER');
assert(bot.personality.huntingAggression > 0, 'Bot has hunter personality configured');

const dummySnakes = [snake, bot];
bot.updateAI(0.016, dummySnakes, foodMgr, grid);
bot.update(0.016, foodMgr, particles, null);
assert(!bot.dead, 'Bot updates AI and navigates without error');

// 5. Verify Food Ecosystem
foodMgr.init();
assert(foodMgr.foods.length >= CONFIG.MAX_FOOD_COUNT, 'FoodManager populates ambient foods');
const prey = foodMgr.foods.filter(f => f.type === 'prey');
assert(prey.length >= CONFIG.SPECIAL_PREY_COUNT, 'FoodManager populates special fleeing prey');

// 6. Verify Collision Death
const wallBot = new BotSnake('b2', 'WallVictim', CONFIG.WORLD_RADIUS + 50, 0, 'toxic-slime', 'FORAGER');
const died = wallBot.checkCollisions(dummySnakes, grid, null, particles, foodMgr);
assert(died === true && wallBot.dead === true, 'Wall collision kills snake at arena boundary');

// 7. Verify XSS Escaping
const dirtyNickname = '<img src=x onerror=alert(1)>"Hello"\'World\'&';
const sanitized = escapeHTML(dirtyNickname);
assert(!sanitized.includes('<') && !sanitized.includes('>'), 'XSS payload angle brackets are escaped');
assert(sanitized.includes('&lt;img') && sanitized.includes('&quot;Hello&quot;'), 'Tags and quotes are safely converted to HTML entities');

// 8. Verify Equal-Mass Head-on Mutual Destruction
const snakeA = new Snake('sA', 'SnakeA', 500, 500, 'neon-cyan', false);
const snakeB = new Snake('sB', 'SnakeB', 510, 500, 'magma-fire', false);
snakeA.invulnerableTimer = 0;
snakeB.invulnerableTimer = 0;
snakeA.mass = 30;
snakeB.mass = 30;

const combatGrid = new SpatialGrid(CONFIG.SPATIAL_CELL_SIZE);
combatGrid.insert(snakeB.segments[0]); // snakeB head segment
const combatSnakes = [snakeA, snakeB];

const collisionA = snakeA.checkCollisions(combatSnakes, combatGrid, null, particles, foodMgr);
assert(collisionA === true && snakeA.dead === true && snakeB.dead === true, 'Equal-mass head-on collision causes mutual destruction');

console.log('--- All Slyth.io Verification Tests Passed! ---');
