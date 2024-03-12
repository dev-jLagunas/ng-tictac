import { Injectable } from '@angular/core';
import { Cell } from '../types/cell.type';

@Injectable({
  providedIn: 'root',
})
export class GameplayService {
  board: Cell[] = [];
  activePlayer: 'X' | 'O' = 'X';
  winningPlayer: 'X' | 'O' | null = null;
  isTie: boolean = false;
  gameOver: boolean = false;
  timer: number = 10;
  timerInterval: any;
  isTimerExpired: boolean = false;

  constructor() {
    this.createBoard();
  }

  createBoard(): void {
    this.board = [];
    for (let i = 0; i < 9; i++) {
      this.board.push({ id: i, state: null });
    }
  }

  getBoard(): Cell[] {
    return this.board;
  }

  getActivePlayer(): 'X' | 'O' {
    return this.activePlayer;
  }

  updateCell(cell: Cell): void | string {
    if (!cell.state) {
      this.startTimer();
      cell.state = this.activePlayer;

      if (this.checkGameStatus()) {
        this.winningPlayer = this.activePlayer;
        this.gameOver = true;
        clearInterval(this.timerInterval);
        this.timer = 10;
      } else {
        this.activePlayer = this.activePlayer === 'X' ? 'O' : 'X';
      }

      if (this.board.filter((cell) => cell.state !== null).length === 9) {
        this.isTie = true;
        this.gameOver = true;
        this.timer = 10;
        clearInterval(this.timerInterval);
      }
    }
  }

  makeComputerMove(): void {
    if (this.activePlayer === 'O' && !this.gameOver && !this.isTimerExpired) {
      let emptyCells = this.board.filter((cell) => cell.state === null);
      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCell = emptyCells[randomIndex];

        this.updateCell(randomCell);
      }
    }
  }

  checkGameStatus(): boolean {
    // Check rows, columns, and diagonals
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

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        this.board[a].state &&
        this.board[a].state === this.board[b].state &&
        this.board[a].state === this.board[c].state
      ) {
        return true; // There is a winner
      }
    }

    // Check for tie (i.e. all cells are filled with no winning combination)
    if (this.board.every((cell) => cell.state !== null)) {
      return false;
    }

    return false;
  }

  startTimer(): void {
    clearInterval(this.timerInterval);
    this.timer = 10;
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.isTimerExpired = true;
      }
    }, 1000);
  }

  resetGame(): void {
    this.createBoard();
    clearInterval(this.timerInterval);
    this.activePlayer = 'X';
    this.winningPlayer = null;
    this.timer = 10;
    this.isTimerExpired = false;
    this.isTie = false;
    this.gameOver = false;
  }
}
