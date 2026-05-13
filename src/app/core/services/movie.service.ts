import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieResponse, Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseUrl;

  getTrendingMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/trending/movie/day`);
  }

  getPopularMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular`);
  }

  getMovieById(id: string | number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}`);
  }
}
