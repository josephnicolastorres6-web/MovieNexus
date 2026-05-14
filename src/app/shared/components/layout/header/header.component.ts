import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { Movie } from '../../../../core/models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private movieService = inject(MovieService);

  searchQuery = signal('');
  searchResults = signal<Movie[]>([]);
  isSearching = signal(false);

  constructor() {
    effect((onCleanup) => {
      const query = this.searchQuery();

      if (query.length < 3) {
        this.searchResults.set([]);
        this.isSearching.set(false);
        return;
      }

      this.isSearching.set(true);

      const timer = setTimeout(() => {
        this.movieService.searchMovies(query).subscribe({
          next: (response) => {
            this.searchResults.set(response.results.slice(0, 5)); // Mostramos solo 5
            this.isSearching.set(false);
          },
          error: () => this.isSearching.set(false)
        });
      }, 500); // 500ms de retraso (Debounce)

      onCleanup(() => clearTimeout(timer));
    });
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  closeSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
  }
}
