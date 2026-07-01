import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovieService } from './movie.service';
import { Movie } from '../models/movie.model';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  suggestedMovies?: Movie[];
}

interface GeminiResponse {
  text: string;
  suggestedMovies: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private http = inject(HttpClient);
  private movieService = inject(MovieService);
  
  // Usando Signals para manejar el estado del chat
  chatHistory = signal<ChatMessage[]>([]);
  isLoading = signal<boolean>(false);

  async sendMessage(userMessage: string) {
    this.isLoading.set(true);
    
    // Añadir mensaje del usuario al historial
    const history = this.chatHistory();
    this.chatHistory.update(current => [...current, { role: 'user', parts: [{ text: userMessage }] }]);

    try {
      // Llamada al endpoint backend
      // Formatear historial para Gemini (requiere role y parts)
      const geminiHistory = history.map(msg => {
        if (msg.role === 'model') {
          return {
            role: msg.role,
            parts: [{ 
              text: JSON.stringify({
                text: msg.parts[0].text,
                suggestedMovies: msg.suggestedMovies ? msg.suggestedMovies.map(m => m.title) : []
              }) 
            }]
          };
        }
        return {
          role: msg.role,
          parts: msg.parts
        };
      });

      this.http.post<GeminiResponse>('/api/chat', { 
        history: geminiHistory,
        message: userMessage
      }).subscribe({
        next: (response) => {
          this.processGeminiResponse(response);
        },
        error: (err) => {
          console.error('❌ ERROR DETALLADO DE CONEXIÓN CON VERCEL/GEMINI:', err);
          console.error('Status:', err.status, 'Message:', err.message);
          
          let errorMsg = 'Lo siento, hubo un error al conectar con mis circuitos cinéfilos. Intenta nuevamente más tarde.';
          if (err.error && err.error.error && err.error.error.includes('GEMINI_API_KEY')) {
            errorMsg = `⚠️ Error Crítico: ${err.error.error} Por favor, ve a la configuración de Vercel y añade la variable de entorno. Luego haz un "Redeploy".`;
          }

          this.chatHistory.update(current => [...current, { 
            role: 'model', 
            parts: [{ text: errorMsg }] 
          }]);
          this.isLoading.set(false);
        }
      });
    } catch (error) {
      console.error(error);
      this.isLoading.set(false);
    }
  }

  private processGeminiResponse(response: GeminiResponse) {
    const newMsg: ChatMessage = {
      role: 'model',
      parts: [{ text: response.text }],
      suggestedMovies: []
    };

    if (response.suggestedMovies && response.suggestedMovies.length > 0) {
      // Buscar las películas sugeridas en TMDB
      const searchRequests = response.suggestedMovies.map(title => 
        this.movieService.searchMovies(title).pipe(
          map(res => res.results.length > 0 ? res.results[0] : null),
          catchError(() => of(null))
        )
      );

      forkJoin(searchRequests).subscribe(movies => {
        newMsg.suggestedMovies = movies.filter((m): m is Movie => m !== null);
        this.chatHistory.update(current => [...current, newMsg]);
        this.isLoading.set(false);
      });
    } else {
      this.chatHistory.update(current => [...current, newMsg]);
      this.isLoading.set(false);
    }
  }

  clearChat() {
    this.chatHistory.set([]);
  }
}
