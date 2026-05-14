import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../core/services/favorites.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  public favoritesService = inject(FavoritesService);
  
  get favoriteMovies() {
    return this.favoritesService.favorites();
  }
}
