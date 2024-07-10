import { Component } from '@angular/core';
import { GameplayService } from '../../service/gameplay.service';
import { Cell } from '../../types/cell.type';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-one-player',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './one-player.component.html',
  styleUrl: './one-player.component.scss',
})
export class OnePlayerComponent {
  constructor(public gameplayService: GameplayService) {}

  get board(): Cell[] {
    return this.gameplayService.board$();
  }

  get activePlayer(): 'X' | 'O' {
    return this.gameplayService.activePlayer$();
  }

  get winningPlayer(): 'X' | 'O' | null {
    return this.gameplayService.winningPlayer$();
  }

  get isTie(): boolean {
    return this.gameplayService.isTie$();
  }

  get gameOver(): boolean {
    return this.gameplayService.gameOver$();
  }

  get timer(): number {
    return this.gameplayService.timer$();
  }

  get isTimerExpired(): boolean {
    return this.gameplayService.isTimerExpired$();
  }

  updateCell(cell: Cell): void {
    this.gameplayService.updateCell(cell);
    setTimeout(() => {
      this.gameplayService.makeComputerMove();
    }, 1000);
  }

  resetGame(): void {
    this.gameplayService.resetGame();
  }
}
