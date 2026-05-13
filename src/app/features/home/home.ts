import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { HeroComponent } from './components/hero/hero.component';
import { MovieSliderComponent } from '../../shared/components/movie-slider/movie-slider.component';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HeroComponent, MovieSliderComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private movieService = inject(MovieService);
  
  featuredMovie = signal<Movie | null>(null);
  trendingMovies = signal<Movie[]>([]);
  popularMovies = signal<Movie[]>([]);

  ngOnInit(): void {
    this.movieService.getTrendingMovies().subscribe({
      next: (data) => {
        if (data.results.length > 0) {
          this.featuredMovie.set(data.results[0]);
          this.trendingMovies.set(data.results);
        }
      }
    });

    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.popularMovies.set(data.results);
      }
    });
  }
}
