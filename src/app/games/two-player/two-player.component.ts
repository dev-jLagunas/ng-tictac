import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Cell } from '../../types/cell.type';
import { GameplayService } from '../../service/gameplay.service';
@Component({
  selector: 'app-two-player',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './two-player.component.html',
  styleUrl: './two-player.component.scss',
})
export class TwoPlayerComponent {
  constructor(public gameplayService: GameplayService) {}

  get board(): Cell[] {
    return this.gameplayService.getBoard();
  }

  get activePlayer(): 'X' | 'O' {
    return this.gameplayService.getActivePlayer();
  }

  updateCell(cell: Cell): void {
    this.gameplayService.updateCell(cell);
  }

  resetGame(): void {
    this.gameplayService.resetGame();
  }
}
