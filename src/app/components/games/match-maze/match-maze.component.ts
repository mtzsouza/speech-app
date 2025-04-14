import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

type Direction = 'up' | 'down' | 'left' | 'right';

interface MazeCell {
  x: number;
  y: number;
  value: string;
  visited: boolean;
  correct?: boolean;
  blocked?: boolean;
  walls: Record<Direction, boolean>;
  challengeCompletedDirs: Direction[];
  blockedDirs: Direction[];
}

@Component({
  selector: 'app-match-maze',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './match-maze.component.html',
  styleUrl: './match-maze.component.sass',
})
export class MatchMazeComponent implements OnInit {
  maze: MazeCell[][] = [];
  playerPosition = { x: 0, y: 0 };
  path: { x: number; y: number }[] = [];
  showVictoryMessage = false;
  gameWon = false;
  currentChallenge: { dir: Direction; ipa: string } | null = null;
  choices: string[] = [];
  currentAudio: HTMLAudioElement | null = null;

  readonly size = 5;

  readonly phoneticMap: Record<string, string> = {
    '/eɪ/': 'a (long)', '/æ/': 'a (short)', '/i/': 'e (long)', '/ɛ/': 'e (short)',
    '/aɪ/': 'i (long)', '/ɪ/': 'i (short)', '/oʊ/': 'o (long)', '/ɑ/': 'o (short)',
    '/ju/': 'u (long)', '/ʌ/': 'u (short)', '/ʊ/': 'u (short)'
  };
  readonly phonemes = Object.keys(this.phoneticMap);

  deltas: Record<Direction, { dx: number; dy: number; opposite: Direction }> = {
    up: { dx: 0, dy: -1, opposite: 'down' },
    down: { dx: 0, dy: 1, opposite: 'up' },
    left: { dx: -1, dy: 0, opposite: 'right' },
    right: { dx: 1, dy: 0, opposite: 'left' }
  };

  ngOnInit(): void {
    this.generateMaze();
    this.setChallenge();
    this.path = [{ x: 0, y: 0 }];
  }

  generateMaze(): void {
    this.maze = Array.from({ length: 5 }, (_, y) =>
      Array.from({ length: 5 }, (_, x) => ({
        x,
        y,
        value: this.randomPhoneme(),
        visited: false,
        correct: false,
        blocked: false,
        walls: { up: true, down: true, left: true, right: true },
        challengeCompletedDirs: [],
        blockedDirs: []
      }))
    );

    const stack: MazeCell[] = [];
    const start = this.maze[0][0];
    start.visited = true;
    stack.push(start);

    while (stack.length) {
      const current = stack.pop()!;
      const neighbors = this.getUnvisitedNeighbors(current);

      if (neighbors.length) {
        stack.push(current);
        const { neighbor, dir } = neighbors[Math.floor(Math.random() * neighbors.length)];

        current.walls[dir] = false;
        neighbor.walls[this.deltas[dir].opposite] = false;
        neighbor.visited = true;
        stack.push(neighbor);
      }
    }

    for (const row of this.maze) for (const cell of row) cell.visited = false;

    this.playerPosition = { x: 0, y: 0 };
    this.getCurrentCell().visited = true;
    this.path = [{ x: 0, y: 0 }];
  }

  getUnvisitedNeighbors(cell: MazeCell) {
    const neighbors: { neighbor: MazeCell; dir: Direction }[] = [];
    for (const dir of Object.keys(this.deltas) as Direction[]) {
      const { dx, dy } = this.deltas[dir];
      const nx = cell.x + dx;
      const ny = cell.y + dy;
      if (nx >= 0 && ny >= 0 && nx < this.size && ny < this.size) {
        const neighbor = this.maze[ny][nx];
        if (!neighbor.visited) neighbors.push({ neighbor, dir });
      }
    }
    return neighbors;
  }

  randomPhoneme(): string {
    const index = Math.floor(Math.random() * this.phonemes.length);
    return this.phonemes[index];
  }

  getCurrentCell(): MazeCell {
    return this.maze[this.playerPosition.y][this.playerPosition.x];
  }

  getTargetCell(dir: Direction): MazeCell | null {
    const { dx, dy } = this.deltas[dir];
    const nx = this.playerPosition.x + dx;
    const ny = this.playerPosition.y + dy;
    if (nx < 0 || ny < 0 || nx >= this.size || ny >= this.size) return null;
    return this.maze[ny][nx];
  }

  setChallenge(): void {
    const cell = this.getCurrentCell();
    const options = (Object.keys(this.deltas) as Direction[])
      .filter(dir =>
        !cell.walls[dir] &&
        !cell.challengeCompletedDirs.includes(dir) &&
        !cell.blockedDirs.includes(dir)
      );

    if (!options.length) {
      const fallbackDirs = (Object.keys(this.deltas) as Direction[]).filter(
        dir => !cell.walls[dir]
      );
      if (!fallbackDirs.length) {
        this.currentChallenge = null;
        this.choices = [];
        return;
      }

      const fallbackDir = fallbackDirs[Math.floor(Math.random() * fallbackDirs.length)];
      const target = this.getTargetCell(fallbackDir)!;
      const ipa = target.value;

      this.currentChallenge = { dir: fallbackDir, ipa };
      this.choices = this.shuffle([ipa, ...this.phonemes.filter(p => p !== ipa).slice(0, 2)]);
      this.playSound(ipa);
      return;
    }

    const dir = options[Math.floor(Math.random() * options.length)];
    const target = this.getTargetCell(dir)!;
    const ipa = target.value;

    this.currentChallenge = { dir, ipa };
    this.choices = this.shuffle([ipa, ...this.phonemes.filter(p => p !== ipa).slice(0, 2)]);
    this.playSound(ipa);
    console.log("✅ Correct answer:", this.phoneticMap[ipa] || ipa);
  }

  selectSound(ipa: string): void {
    if (!this.currentChallenge) return;
    const { dir, ipa: correctIPA } = this.currentChallenge;
    const cell = this.getCurrentCell();

    if (ipa === correctIPA) {
      cell.challengeCompletedDirs.push(dir);
      const next = this.getTargetCell(dir)!;
      next.visited = true;
      this.playerPosition = { x: next.x, y: next.y };
      this.path.push({ x: next.x, y: next.y });
      this.checkWin();
    } else {
      cell.blockedDirs.push(dir);
    }

    this.setChallenge();
  }

  checkWin(): void {
    if (this.playerPosition.x === this.size - 1 && this.playerPosition.y === this.size - 1) {
      this.gameWon = true;
      this.showVictoryMessage = true;
    }
  }

  replaySound(): void {
    if (this.currentChallenge) {
      this.playSound(this.currentChallenge.ipa);
    }
  }

  playSound(ipa: string): void {
    this.currentAudio?.pause();
    const path = `/assets/sounds/engPronunciations/${ipa.replace(/\//g, '')}.mp3`;
    this.currentAudio = new Audio(path);
    this.currentAudio.play().catch(console.error);
  }

  resetGame(): void {
    this.gameWon = false;
    this.showVictoryMessage = false;
    this.generateMaze();
    this.setChallenge();
    this.path = [{ x: 0, y: 0 }];
  }

  hideVictoryMessage(): void {
    this.showVictoryMessage = false;
  }

  isPlayer(cell: MazeCell): boolean {
    return this.playerPosition.x === cell.x && this.playerPosition.y === cell.y;
  }

  isInPath(cell: MazeCell): boolean {
    return this.path.some(p => p.x === cell.x && p.y === cell.y);
  }

  shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }
}
