import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';
import { FavoritesService } from '../../../core/services/favorites.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  private favoritesService = inject(FavoritesService);

  get posterUrl() {
    return this.movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
      : 'assets/no-poster.png';
  }

  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie.id);
  }

  toggleFavorite(event: Event) {
    event.preventDefault(); // Evita navegar al detalle
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.movie);
  }
}
