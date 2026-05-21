import { Component, inject, OnInit, signal, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { HeroComponent } from './components/hero/hero.component';
import { MovieSliderComponent } from '../../shared/components/movie-slider/movie-slider.component';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { SkeletonHeroComponent } from '../../shared/components/skeleton-hero/skeleton-hero.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    HeroComponent,
    MovieSliderComponent,
    MovieCardComponent,
    SkeletonHeroComponent,
    SkeletonCardComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, AfterViewInit {
  private movieService = inject(MovieService);
  private platformId = inject(PLATFORM_ID);
  
  featuredMovie = signal<Movie | null>(null);
  trendingMovies = signal<Movie[]>([]);
  popularMovies = signal<Movie[]>([]);

  @ViewChild('infiniteAnchor') infiniteAnchor!: ElementRef;
  catalogMovies = signal<Movie[]>([]);
  currentPage = signal(1);
  isFetchingNextPage = signal(false);

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

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initInfiniteScroll();
    }
  }

  private initInfiniteScroll(): void {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isFetchingNextPage()) {
        this.loadMoreMovies();
      }
    }, { rootMargin: '200px' });

    observer.observe(this.infiniteAnchor.nativeElement);
  }

  loadMoreMovies(): void {
    this.isFetchingNextPage.set(true);
    this.movieService.getPopularMovies(this.currentPage()).subscribe({
      next: (data) => {
        this.catalogMovies.set([...this.catalogMovies(), ...data.results]);
        this.currentPage.update(p => p + 1);
        this.isFetchingNextPage.set(false);
      }
    });
  }
}
