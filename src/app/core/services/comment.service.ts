import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly API_URL = 'https://api-comentarios-gm6f.onrender.com/api/comments';
  private readonly APP_ID = 'MovieNexus-JosephNicolas';
  private http = inject(HttpClient);

  getComments(itemId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.API_URL}?appId=${this.APP_ID}&itemId=${itemId}`);
  }

  addComment(comment: Partial<Comment>): Observable<Comment> {
    const newComment = { ...comment, appId: this.APP_ID };
    return this.http.post<Comment>(this.API_URL, newComment);
  }
}
