import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-educational-articles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './educational-articles.component.html',
  styleUrl: './educational-articles.component.sass',
})
export class EducationalArticlesComponent {
  articles = [
    { title: '[Article Title 1]' },
    { title: '[Article Title 2]' },
    { title: '[Article Title 3]' },
    { title: '[Article Title 4]' },
  ];
  searchQuery = '';
  filteredArticles = [...this.articles];

  filterArticles() {
    this.filteredArticles = this.articles.filter((article) =>
      article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
