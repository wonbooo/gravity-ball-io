import type {
  GameStatus,
  GameState,
  GameConfig,
  Ball,
  Food,
  Particle,
  GravityWave,
  Vector2D,
  ScoreRecord,
} from '../types/game';
import { Leaderboard } from '../utils/Leaderboard';
import { SoundManager } from '../utils/SoundManager';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private lastTime = 0;

  // 游戏配置
  public config: GameConfig;

  // 游戏状态
  public status: GameStatus = 'menu';
  public gameState: GameState;

  // 游戏实体
  public playerBalls: Ball[] = []; // 玩家控制的球（可能有多个）
  public balls: Ball[] = []; // AI控制的球
  public foods: Food[] = [];
  public particles: Particle[] = [];
  public gravityWaves: GravityWave[] = [];

  // 相机位置
  public camera: Vector2D = { x: 0, y: 0 };

  // 输入状态
  public inputTarget: Vector2D = { x: 0, y: 0 };

  // 回调函数
  private onStateUpdateCallback?: (state: GameState) => void;

  // AI生成定时器
  private lastAISpawnTime: number = 0;
  private nextAISpawnInterval: number = 30000; // 30秒

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取Canvas上下文');
    this.ctx = ctx;

    this.config = {
      width: canvas.width,
      height: canvas.height,
      worldWidth: 3000,
      worldHeight: 3000,
    };

    this.gameState = {
      status: 'menu',
      score: 0,
      kills: 0,
      survivalTime: 0,
      playerMass: 50,
      leaderboard: [],
    };

    this.resize();
    this.renderBackground(); // 渲染初始背景

    // 立即通知状态更新
    setTimeout(() => {
      this.notifyStateUpdate();
    }, 0);
  }

  // 设置状态更新回调
  onStateUpdate(callback: (state: GameState) => void) {
    this.onStateUpdateCallback = callback;
    // 设置回调后立即通知一次
    this.notifyStateUpdate();
  }

  // 调整Canvas大小
  resize() {
    // 使用window大小而不是容器大小
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.config.width = this.canvas.width;
    this.config.height = this.canvas.height;

    // 如果不在游戏中，重新渲染背景
    if (this.status !== 'playing') {
      this.renderBackground();
    }
  }

  // 开始游戏
  start() {
    this.status = 'playing';
    this.gameState.status = 'playing';
    this.gameState.score = 0;
    this.gameState.kills = 0;
    this.gameState.survivalTime = 0;
    this.gameState.playerMass = 50; // 初始化玩家质量

    this.initGame();
    this.lastTime = performance.now();
    this.lastAISpawnTime = performance.now(); // 初始化AI生成时间
    SoundManager.playBGM();
    this.gameLoop(this.lastTime);
  }

  // 初始化游戏
  private initGame() {
    // 创建玩家
    this.playerBalls = [this.createPlayer()];
    this.balls = [...this.playerBalls];

    // 创建AI
    const aiCount = this.getAICount();
    for (let i = 0; i < aiCount; i++) {
      this.balls.push(this.createAI());
    }

    // 创建食物
    const foodCount = this.getFoodCount();
    for (let i = 0; i < foodCount; i++) {
      this.foods.push(this.createFood());
    }

    this.particles = [];
    this.gravityWaves = [];
  }

  // 创建玩家
  private createPlayer(): Ball {
    return {
      id: 'player',
      x: this.config.worldWidth / 2,
      y: this.config.worldHeight / 2,
      vx: 0,
      vy: 0,
      mass: 50,
      color: '#00f3ff',
      isPlayer: true,
      radius: this.massToRadius(50),
      skills: {
        sprint: { cooldown: 5000, lastUsed: 0, cost: 0.1, active: false },
        split: { cooldown: 10000, lastUsed: 0, cost: 0.5, active: false },
        gravityWave: { cooldown: 8000, lastUsed: 0, cost: 0.2, active: false },
      },
    };
  }

  // 创建AI
  private createAI(): Ball {
    const colors = ['#bc13fe', '#ff006e', '#00ff9f', '#fffa00'];
    return {
      id: `ai-${Math.random().toString(36).substr(2, 9)}`,
      x: Math.random() * this.config.worldWidth,
      y: Math.random() * this.config.worldHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      mass: 30 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      isPlayer: false,
      radius: 0, // 会在update中计算
      skills: {
        sprint: { cooldown: 5000, lastUsed: 0, cost: 0.1, active: false },
        split: { cooldown: 10000, lastUsed: 0, cost: 0.5, active: false },
        gravityWave: { cooldown: 8000, lastUsed: 0, cost: 0.2, active: false },
      },
      state: 'idle',
    };
  }

  // 创建食物
  private createFood(): Food {
    return {
      id: `food-${Math.random().toString(36).substr(2, 9)}`,
      x: Math.random() * this.config.worldWidth,
      y: Math.random() * this.config.worldHeight,
      value: 5 + Math.random() * 10,
      color: '#00f3ff',
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }

  // 质量转半径
  massToRadius(mass: number): number {
    return Math.sqrt(mass) * 3;
  }

  // 获取AI数量
  private getAICount(): number {
    return 15;
  }

  // 获取食物数量
  private getFoodCount(): number {
    return 400;
  }

  // 游戏主循环
  private gameLoop(currentTime: number) {
    if (this.status !== 'playing') return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  // 更新游戏逻辑
  private update(deltaTime: number) {
    // 更新生存时间
    this.gameState.survivalTime += deltaTime;

    // 更新所有球
    this.balls.forEach((ball) => this.updateBall(ball, deltaTime));

    // 更新食物
    this.foods.forEach((food) => {
      food.pulsePhase += deltaTime * 0.003;
    });

    // 更新粒子
    this.particles = this.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= deltaTime;
      return p.life > 0;
    });

    // 更新引力波
    this.gravityWaves = this.gravityWaves.filter((wave) => {
      wave.radius += deltaTime * 0.3;
      return wave.radius < wave.maxRadius;
    });

    // 碰撞检测
    this.checkCollisions();

    // 补充食物
    while (this.foods.length < this.getFoodCount()) {
      this.foods.push(this.createFood());
    }

    // 动态生成AI
    const currentTime = performance.now();
    if (currentTime - this.lastAISpawnTime > this.nextAISpawnInterval) {
      this.spawnAI();
      this.lastAISpawnTime = currentTime;
      // 随机化下次生成时间：30-60秒之间
      this.nextAISpawnInterval = 30000 + Math.random() * 30000;
    }

    // 更新相机（跟随所有玩家球的中心点）
    if (this.playerBalls.length > 0) {
      // 计算所有玩家球的中心位置
      let totalX = 0;
      let totalY = 0;
      let totalMass = 0;
      this.playerBalls.forEach(ball => {
        totalX += ball.x;
        totalY += ball.y;
        totalMass += ball.mass;
      });
      const centerX = totalX / this.playerBalls.length;
      const centerY = totalY / this.playerBalls.length;

      this.camera.x = centerX - this.config.width / 2;
      this.camera.y = centerY - this.config.height / 2;

      // 更新玩家总质量
      this.gameState.playerMass = totalMass;
    }

    // 检查游戏结束
    if (this.playerBalls.length === 0) {
      console.log('[系统] 所有玩家球都被吞噬，游戏结束！');
      this.gameOver();
    }

    // 更新状态
    this.notifyStateUpdate();
  }

  // 生成新的AI
  private spawnAI() {
    // 计算玩家平均质量，AI质量略大于或略小于玩家
    let playerAvgMass = this.gameState.playerMass / Math.max(1, this.playerBalls.length);

    // AI质量在玩家质量的50%-150%之间
    let aiMass = playerAvgMass * (0.5 + Math.random());

    // 确保AI质量在合理范围内
    aiMass = Math.max(20, Math.min(200, aiMass));

    const colors = ['#bc13fe', '#ff006e', '#00ff9f', '#fffa00'];
    const ai: Ball = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: Math.random() * this.config.worldWidth,
      y: Math.random() * this.config.worldHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      mass: aiMass,
      color: colors[Math.floor(Math.random() * colors.length)],
      isPlayer: false,
      radius: 0,
      skills: {
        sprint: { cooldown: 5000, lastUsed: 0, cost: 0.1, active: false },
        split: { cooldown: 10000, lastUsed: 0, cost: 0.5, active: false },
        gravityWave: { cooldown: 8000, lastUsed: 0, cost: 0.2, active: false },
      },
      state: 'idle',
    };

    ai.radius = this.massToRadius(ai.mass);
    this.balls.push(ai);

    console.log(`[系统] 新AI加入！质量: ${Math.floor(aiMass)}, 总AI数: ${this.balls.length}`);
  }

  // 更新球体
  private updateBall(ball: Ball, deltaTime: number) {
    const radius = this.massToRadius(ball.mass);
    ball.radius = radius;

    if (ball.isPlayer) {
      // 玩家控制 - 更直接的控制方式，更高的基础速度
      const dx = this.inputTarget.x - this.config.width / 2;
      const dy = this.inputTarget.y - this.config.height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 5) {
        // 玩家基础速度更高，质量影响更小
        const speed = 6 / Math.sqrt(Math.max(ball.mass / 80, 0.7)); // 基础速度6，最小影响0.7
        const targetVx = (dx / dist) * speed;
        const targetVy = (dy / dist) * speed;

        // 更快的响应（20%新速度，80%旧速度）
        ball.vx = ball.vx * 0.8 + targetVx * 0.2;
        ball.vy = ball.vy * 0.8 + targetVy * 0.2;
      } else {
        // 接近目标时快速停止
        ball.vx *= 0.85;
        ball.vy *= 0.85;
      }
    } else {
      // AI逻辑（简化版）
      this.updateAI(ball, deltaTime);
    }

    // 更新位置
    ball.x += ball.vx;
    ball.y += ball.vy;

    // 边界检测
    ball.x = Math.max(radius, Math.min(this.config.worldWidth - radius, ball.x));
    ball.y = Math.max(radius, Math.min(this.config.worldHeight - radius, ball.y));

    // 更新技能冷却
    Object.values(ball.skills).forEach((skill) => {
      if (skill.active && Date.now() - skill.lastUsed > 1000) {
        skill.active = false;
      }
    });
  }

  // 更新AI（简单版）
  private updateAI(ball: Ball, _deltaTime: number) {
    // 找最近的食物
    let nearestFood: Food | null = null;
    let minDist = Infinity;

    for (const food of this.foods) {
      const dx = food.x - ball.x;
      const dy = food.y - ball.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        nearestFood = food;
      }
    }

    if (nearestFood) {
      const dx = nearestFood.x - ball.x;
      const dy = nearestFood.y - ball.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // AI速度也提高了，从2改为4
      const speed = 4 / Math.sqrt(Math.max(ball.mass / 80, 0.7));

      ball.vx += (dx / dist) * speed * 0.08;
      ball.vy += (dy / dist) * speed * 0.08;
    }

    // AI摩擦力
    ball.vx *= 0.95;
    ball.vy *= 0.95;
  }

  // 碰撞检测
  private checkCollisions() {
    // 球与食物的碰撞
    this.balls.forEach((ball) => {
      this.foods = this.foods.filter((food) => {
        const dx = food.x - ball.x;
        const dy = food.y - ball.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ball.radius) {
          // 玩家吞噬食物获得1.5-3倍质量增益
          const multiplier = ball.isPlayer ? (1.5 + Math.random()) : 1;
          ball.mass += food.value * multiplier;
          this.createParticles(food.x, food.y, food.color, 5);
          if (ball.isPlayer) {
            this.gameState.score += Math.floor(food.value * multiplier);
            SoundManager.playEat();
          }
          return false;
        }
        return true;
      });
    });

    // 球与球的碰撞
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const ball1 = this.balls[i];
        const ball2 = this.balls[j];

        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 当两个球接触时，质量大的直接吞噬质量小的
        if (dist < ball1.radius + ball2.radius) {
          // 玩家自己的球不会互相吞噬
          if (ball1.isPlayer && ball2.isPlayer) {
            continue;
          }

          if (ball1.mass > ball2.mass) {
            this.eatBall(ball1, ball2, j);
            j--;
          } else {
            this.eatBall(ball2, ball1, i);
            i--;
            break;
          }
        }
      }
    }
  }

  // 吞噬球体
  private eatBall(predator: Ball, prey: Ball, preyIndex: number) {
    predator.mass = Math.sqrt(predator.mass ** 2 + prey.mass ** 2);
    this.createParticles(prey.x, prey.y, prey.color, 20);

    if (predator.isPlayer) {
      this.gameState.kills++;
      this.gameState.score += Math.floor(prey.mass * 10);
      SoundManager.playEat();
    }

    // 如果被吃的是玩家球，从playerBalls中移除
    if (prey.isPlayer) {
      const index = this.playerBalls.indexOf(prey);
      if (index > -1) {
        this.playerBalls.splice(index, 1);
        console.log(`[系统] 玩家球被吞噬，剩余 ${this.playerBalls.length} 个玩家球`);
      }
    }

    this.balls.splice(preyIndex, 1);
  }

  // 创建粒子
  private createParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 500 + Math.random() * 500,
        maxLife: 1000,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  // 渲染背景（用于菜单界面）
  private renderBackground() {
    const { ctx, config } = this;

    // 清空画布
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, config.width, config.height);

    // 绘制星空
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * config.width;
      const y = Math.random() * config.height;
      const size = Math.random() * 2;
      const opacity = 0.3 + Math.random() * 0.7;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    // 绘制网格
    ctx.strokeStyle = '#1a1a3a';
    ctx.lineWidth = 1;
    const gridSize = 100;

    for (let x = 0; x < config.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, config.height);
      ctx.stroke();
    }

    for (let y = 0; y < config.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(config.width, y);
      ctx.stroke();
    }
  }

  // 渲染
  private render() {
    const { ctx, config, camera } = this;

    // 清空画布
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, config.width, config.height);

    // 绘制背景网格
    this.drawGrid();

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // 绘制边界
    ctx.strokeStyle = '#1a1a3a';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, config.worldWidth, config.worldHeight);

    // 绘制食物
    this.foods.forEach((food) => {
      const pulse = 1 + Math.sin(food.pulsePhase) * 0.2;
      ctx.beginPath();
      ctx.arc(food.x, food.y, 5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = food.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = food.color;
      ctx.fill();
    });

    // 绘制球体
    this.balls.forEach((ball) => {
      this.drawBall(ball);
    });

    // 绘制粒子
    this.particles.forEach((p) => {
      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    ctx.restore();
  }

  // 绘制球体
  private drawBall(ball: Ball) {
    const { ctx } = this;

    // 发光效果
    ctx.shadowBlur = 20;
    ctx.shadowColor = ball.color;

    // 渐变填充
    const gradient = ctx.createRadialGradient(
      ball.x,
      ball.y,
      0,
      ball.x,
      ball.y,
      ball.radius
    );
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.3, ball.color);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 边框
    ctx.strokeStyle = ball.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // 显示质量（所有球都显示）
    const massText = Math.floor(ball.mass).toString();
    const fontSize = Math.max(12, Math.min(16, ball.radius / 2)); // 根据球大小调整字体

    ctx.fillStyle = 'white';
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 文字阴影确保清晰可见
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 3;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.strokeText(massText, ball.x, ball.y);
    ctx.fillText(massText, ball.x, ball.y);
    ctx.shadowBlur = 0;

    // 如果是玩家球，添加额外的光环效果
    if (ball.isPlayer) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // 绘制网格
  private drawGrid() {
    const { ctx, config, camera } = this;
    const gridSize = 100;
    const offsetX = -camera.x % gridSize;
    const offsetY = -camera.y % gridSize;

    ctx.strokeStyle = '#1a1a3a';
    ctx.lineWidth = 1;

    for (let x = offsetX; x < config.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, config.height);
      ctx.stroke();
    }

    for (let y = offsetY; y < config.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(config.width, y);
      ctx.stroke();
    }
  }

  // 使用技能
  useSkill(skillName: string) {
    if (this.playerBalls.length === 0) return;

    // 使用第一个玩家球的质量和技能
    const mainPlayer = this.playerBalls[0];
    const skill = mainPlayer.skills[skillName as keyof typeof mainPlayer.skills];
    if (!skill) return;

    // Q和E技能只检查质量，不检查冷却时间
    if (skillName === 'sprint' || skillName === 'gravityWave') {
      // 计算消耗
      const cost = skillName === 'sprint'
        ? Math.max(1, Math.min(5, mainPlayer.mass * 0.05))
        : Math.max(3, Math.min(10, mainPlayer.mass * 0.1));

      // 检查质量是否足够
      if (mainPlayer.mass < cost) {
        return;
      }

      // W分裂技能保留冷却限制
    } else {
      const now = Date.now();
      if (now - skill.lastUsed < skill.cooldown) {
        console.log('技能冷却中');
        return;
      }

      // 检查质量是否足够（需要至少20质量才能使用技能）
      if (mainPlayer.mass < 20) {
        console.log('质量不足');
        return;
      }

      skill.lastUsed = now;
    }

    skill.active = true;
    SoundManager.playSkill();

    switch (skillName) {
      case 'sprint':
        // 冲刺效果 - 所有玩家球都冲刺
        this.playerBalls.forEach(ball => {
          const angle = Math.atan2(
            this.inputTarget.y - this.config.height / 2,
            this.inputTarget.x - this.config.width / 2
          );
          const speed = 10;
          ball.vx += Math.cos(angle) * speed;
          ball.vy += Math.sin(angle) * speed;

          // 动态消耗：基于质量，控制在1-5之间
          const cost = Math.max(1, Math.min(5, ball.mass * 0.05));
          ball.mass -= cost;

          // 反向吐出食物
          const reverseAngle = angle + Math.PI; // 反向
          const foodCount = Math.floor(cost / 2); // 根据消耗吐出食物
          for (let i = 0; i < foodCount; i++) {
            const spreadAngle = reverseAngle + (Math.random() - 0.5) * 0.5; // 轻微随机扩散
            const distance = ball.radius + 10 + Math.random() * 20;
            const food: Food = {
              id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              x: ball.x + Math.cos(spreadAngle) * distance,
              y: ball.y + Math.sin(spreadAngle) * distance,
              value: cost / foodCount,
              color: ball.color,
              pulsePhase: Math.random() * Math.PI * 2,
            };
            this.foods.push(food);
          }
        });
        break;
      case 'gravityWave':
        // 引力波 - 从第一个玩家球位置释放
        this.gravityWaves.push({
          ownerId: mainPlayer.id,
          x: mainPlayer.x,
          y: mainPlayer.y,
          radius: 0,
          maxRadius: 200,
          strength: 0.5,
        });

        // 动态消耗：基于质量，控制在3-10之间
        const cost = Math.max(3, Math.min(10, mainPlayer.mass * 0.1));
        mainPlayer.mass -= cost;

        // 向四周吐出食物（引力波效果）
        const foodCount = Math.floor(cost);
        for (let i = 0; i < foodCount; i++) {
          const angle = (Math.PI * 2 * i) / foodCount;
          const distance = mainPlayer.radius + 20 + Math.random() * 30;
          const food: Food = {
            id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            x: mainPlayer.x + Math.cos(angle) * distance,
            y: mainPlayer.y + Math.sin(angle) * distance,
            value: cost / foodCount,
            color: mainPlayer.color,
            pulsePhase: Math.random() * Math.PI * 2,
          };
          this.foods.push(food);
        }
        break;
      case 'split':
        // 分裂功能
        if (mainPlayer.mass < 40) {
          return;
        }
        this.splitPlayer(mainPlayer);
        break;
    }
  }

  // 游戏结束
  private gameOver() {
    this.status = 'gameover';
    this.gameState.status = 'gameover';

    // 播放死亡音效
    SoundManager.playDeath();
    SoundManager.stopBGM();

    // 保存分数到排行榜
    const record: ScoreRecord = {
      score: this.gameState.score,
      survivalTime: this.gameState.survivalTime,
      kills: this.gameState.kills,
      date: new Date().toISOString(),
      difficulty: 'hard',
    };
    Leaderboard.save(record);

    // 更新排行榜
    this.gameState.leaderboard = Leaderboard.getAll();

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.notifyStateUpdate();
  }

  // 通知状态更新
  private notifyStateUpdate() {
    if (this.onStateUpdateCallback) {
      this.onStateUpdateCallback({ ...this.gameState });
    }
  }

  // 暂停游戏
  pause() {
    if (this.status === 'playing') {
      this.status = 'paused';
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  // 恢复游戏
  resume() {
    if (this.status === 'paused') {
      this.status = 'playing';
      this.lastTime = performance.now();
      this.gameLoop(this.lastTime);
    }
  }

  // 销毁游戏
  destroy() {
    this.pause();
    SoundManager.stopBGM();
    this.status = 'menu';
  }

  // 分裂玩家
  private splitPlayer(player: Ball) {
    const newMass = player.mass / 2;
    player.mass = newMass;
    player.radius = this.massToRadius(newMass); // 更新原球半径

    // 计算分裂方向 - 垂直于当前移动方向
    const splitAngle = Math.atan2(player.vy, player.vx) + Math.PI / 2;
    const splitDistance = player.radius * 3; // 分裂距离为半径的3倍

    // 原球向一个方向移动
    player.x += Math.cos(splitAngle) * splitDistance;
    player.y += Math.sin(splitAngle) * splitDistance;

    // 创建分裂出的新球 - 向相反方向移动
    const newBall: Ball = {
      ...player,
      id: `player-${Date.now()}`,
      mass: newMass,
      radius: this.massToRadius(newMass), // 明确设置新球半径
      x: player.x - Math.cos(splitAngle) * splitDistance * 2, // 新球在原球的相反方向
      y: player.y - Math.sin(splitAngle) * splitDistance * 2,
      vx: -player.vx + (Math.random() - 0.5) * 2, // 速度方向相反
      vy: -player.vy + (Math.random() - 0.5) * 2,
      skills: {
        sprint: { cooldown: 5000, lastUsed: 0, cost: 0.1, active: false },
        split: { cooldown: 10000, lastUsed: 0, cost: 0.5, active: false },
        gravityWave: { cooldown: 8000, lastUsed: 0, cost: 0.2, active: false },
      },
    };

    // 只添加新球到数组（原球已经在数组中了）
    this.playerBalls.push(newBall);
    this.balls.push(newBall);

    console.log(`[技能] 分裂成功！现在有 ${this.playerBalls.length} 个玩家球`);
    console.log(`[调试] 原球位置: (${Math.floor(player.x)}, ${Math.floor(player.y)}), 新球位置: (${Math.floor(newBall.x)}, ${Math.floor(newBall.y)})`);

    // 创建分裂特效
    this.createParticles(player.x, player.y, player.color, 30);
  }
}
