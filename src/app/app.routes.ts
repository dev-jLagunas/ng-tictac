import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OnePlayerComponent } from './games/one-player/one-player.component';
import { TwoPlayerComponent } from './games/two-player/two-player.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '1player', component: OnePlayerComponent },
  { path: '2player', component: TwoPlayerComponent },
];
