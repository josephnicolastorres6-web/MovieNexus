import { Component, OnInit, inject } from '@angular/core';
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private movieService = inject(MovieService);

  ngOnInit(): void {
    console.log('Home Inicializado. Cargando peliculas...');
    this.movieService.getTrendingMovies().subscribe(response => {
      console.log('¡Éxito! Datos recibidos de TMDB: ', response.results);
    });
  }
}
