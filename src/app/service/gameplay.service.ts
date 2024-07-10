import { Injectable, signal, Signal } from '@angular/core';

interface Cell {
  id: number;
  state: 'X' | 'O' | null;
}

@Injectable({
  providedIn: 'root',
})
export class GameplayService {
  private readonly initialBoard: Cell[] = Array.from(
    { length: 9 },
    (_, id) => ({ id, state: null })
  );

  private boardSignal = signal<Cell[]>(this.initialBoard);
  public board$ = this.boardSignal;

  private activePlayerSignal = signal<'X' | 'O'>('X');
  public activePlayer$ = this.activePlayerSignal;

  private winningPlayerSignal = signal<'X' | 'O' | null>(null);
  public winningPlayer$ = this.winningPlayerSignal;

  private isTieSignal = signal<boolean>(false);
  public isTie$ = this.isTieSignal;

  private gameOverSignal = signal<boolean>(false);
  public gameOver$ = this.gameOverSignal;

  private timerSignal = signal<number>(10);
  public timer$ = this.timerSignal;

  private isTimerExpiredSignal = signal<boolean>(false);
  public isTimerExpired$ = this.isTimerExpiredSignal;

  private timerInterval: any;

  constructor() {}

  updateCell(cell: Cell): void {
    if (cell.state === null) {
      this.startTimer();
      const updatedBoard = this.boardSignal().map((c) =>
        c.id === cell.id ? { ...c, state: this.activePlayerSignal() } : c
      );
      this.boardSignal.set(updatedBoard);

      this.handleGameStatus(updatedBoard);
    }
  }

  private handleGameStatus(board: Cell[]): void {
    const gameStatus = this.checkGameStatus(board);
    if (gameStatus === 'win') {
      this.winningPlayerSignal.set(this.activePlayerSignal());
      this.resetTimer();
    } else if (gameStatus === 'tie') {
      this.isTieSignal.set(true);
      this.gameOverSignal.set(true);
      this.resetTimer();
    } else {
      this.switchPlayer();
    }
  }

  private switchPlayer(): void {
    this.activePlayerSignal.set(this.activePlayerSignal() === 'X' ? 'O' : 'X');
  }

  makeComputerMove(): void {
    if (
      this.activePlayerSignal() === 'O' &&
      !this.gameOverSignal() &&
      !this.isTimerExpiredSignal()
    ) {
      const emptyCells = this.boardSignal().filter(
        (cell) => cell.state === null
      );
      if (emptyCells.length > 0) {
        const randomCell =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.updateCell(randomCell);
      }
    }
  }

  private checkGameStatus(board: Cell[]): string {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const [a, b, c] of winningCombinations) {
      if (
        board[a].state &&
        board[a].state === board[b].state &&
        board[a].state === board[c].state
      ) {
        return 'win';
      }
    }

    return board.every((cell) => cell.state !== null) ? 'tie' : 'continue';
  }

  private startTimer(): void {
    this.resetTimer();
    this.timerSignal.set(10);
    this.timerInterval = setInterval(() => {
      const currentTimer = this.timerSignal() - 1;
      this.timerSignal.set(currentTimer);
      if (currentTimer <= 0) {
        clearInterval(this.timerInterval);
        this.isTimerExpiredSignal.set(true);
      }
    }, 1000);
  }

  private resetTimer(): void {
    clearInterval(this.timerInterval);
  }

  resetGame(): void {
    this.boardSignal.set(this.initialBoard);
    this.activePlayerSignal.set('X');
    this.winningPlayerSignal.set(null);
    this.timerSignal.set(10);
    this.isTimerExpiredSignal.set(false);
    this.isTieSignal.set(false);
    this.gameOverSignal.set(false);
  }
}
