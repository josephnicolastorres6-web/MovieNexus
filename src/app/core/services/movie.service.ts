import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieResponse, Movie, WatchProvidersResponse } from '../models/movie.model';
import { CreditsResponse } from '../models/cast.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseUrl;

  getTrendingMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/trending/movie/day`);
  }

  getPopularMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular`, {
      params: { page: page.toString() }
    });
  }

  getMovieById(id: string | number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}`);
  }

  getMovieCredits(id: string | number): Observable<CreditsResponse> {
    return this.http.get<CreditsResponse>(`${this.apiUrl}/movie/${id}/credits`);
  }

  searchMovies(query: string) {
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie`, {
      params: { query }
    });
  }

  getMovieVideos(id: string | number) {
    return this.http.get<{ results: Array<{key: string; site: string; type: string; name: string}> }>(
      `${this.apiUrl}/movie/${id}/videos`
    );
  }

  getWatchProviders(id: string | number): Observable<WatchProvidersResponse> {
    return this.http.get<WatchProvidersResponse>(`${this.apiUrl}/movie/${id}/watch/providers`);
  }
}
