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
    return this.gameplayService.getBoard();
  }

  get activePlayer(): 'X' | 'O' {
    return this.gameplayService.getActivePlayer();
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
