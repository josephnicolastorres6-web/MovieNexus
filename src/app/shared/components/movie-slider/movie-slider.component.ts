import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-movie-slider',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SkeletonCardComponent],
  templateUrl: './movie-slider.component.html',
  styleUrl: './movie-slider.component.css'
})
export class MovieSliderComponent {
  @Input({ required: true }) movies: Movie[] = [];
  @Input() title: string = '';
}
