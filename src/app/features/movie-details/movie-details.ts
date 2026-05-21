import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { CreditsResponse } from '../../core/models/cast.model';
import { CastCard } from '../../shared/components/cast-card/cast-card';
import { MovieTrailer } from './components/movie-trailer/movie-trailer';
import { Observable, forkJoin } from 'rxjs';
import { SkeletonHeroComponent } from '../../shared/components/skeleton-hero/skeleton-hero.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, CastCard, MovieTrailer, SkeletonHeroComponent],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {
  private movieService = inject(MovieService);
  
  @Input() id!: string;
  movieData$!: Observable<{ details: Movie; credits: CreditsResponse }>;

  ngOnInit(): void {
    this.movieData$ = forkJoin({
      details: this.movieService.getMovieById(this.id),
      credits: this.movieService.getMovieCredits(this.id)
    });
  }
}
