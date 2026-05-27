import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css'
})
export class EmptyStateComponent {
  icon = input<string>('');
  title = input<string>('No hay resultados');
  message = input<string>('Intenta realizar otra búsqueda.');
  actionText = input<string>();
  actionLink = input<string>();
}
