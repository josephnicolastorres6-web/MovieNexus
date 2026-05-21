import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../core/services/movie.service';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-movie-trailer',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './movie-trailer.html',
  styleUrl: './movie-trailer.css'
})
export class MovieTrailer implements OnInit {
  private movieService = inject(MovieService);
  @Input() movieId!: number;
  trailerKey = signal<string | null>(null);

  ngOnInit(): void {
    if (this.movieId) {
      this.movieService.getMovieVideos(this.movieId).subscribe({
        next: (data) => {
          const trailer = data.results.find(
            v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          if (trailer) {
            this.trailerKey.set(trailer.key);
          }
        }
      });
    }
  }
}
