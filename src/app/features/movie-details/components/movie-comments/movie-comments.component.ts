import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../../core/services/comment.service';
import { Comment } from '../../../../core/models/comment.model';

@Component({
  selector: 'app-movie-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-comments.component.html',
  styleUrls: ['./movie-comments.component.css']
})
export class MovieCommentsComponent implements OnInit {
  @Input() movieId!: number;

  private commentService = inject(CommentService);
  
  comments: Comment[] = [];
  newComment: Partial<Comment> = { author: '', text: '', rating: 0 };
  stars = [1, 2, 3, 4, 5];
  isLoading = true;

  ngOnInit(): void {
    if (this.movieId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.isLoading = true;
    this.commentService.getComments(this.movieId.toString()).subscribe({
      next: (data) => {
        this.comments = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.isLoading = false;
      }
    });
  }

  setRating(rating: number): void {
    this.newComment.rating = rating;
  }

  submitComment(): void {
    if (!this.newComment.author || !this.newComment.text || !this.newComment.rating) return;

    this.newComment.itemId = this.movieId.toString();
    
    this.commentService.addComment(this.newComment).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.newComment = { author: '', text: '', rating: 0 };
      },
      error: (error) => console.error('Error adding comment:', error)
    });
  }
}
