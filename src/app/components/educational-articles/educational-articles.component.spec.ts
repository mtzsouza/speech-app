import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationalArticlesComponent } from './educational-articles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

describe('EducationalArticlesComponent', () => {
  let component: EducationalArticlesComponent;
  let fixture: ComponentFixture<EducationalArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationalArticlesComponent, NavbarComponent, FormsModule], // Include FormsModule for ngModel binding
    }).compileComponents();

    fixture = TestBed.createComponent(EducationalArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter articles based on search query', () => {
    // Set a search query and call the filter function
    component.searchQuery = 'Phonetics';
    component.filterArticles();
    fixture.detectChanges();

    // Expect filtered articles to only include the article with "Phonetics" in the title
    expect(component.filteredArticles.length).toBeGreaterThan(0);
    expect(component.filteredArticles.every(article => article.title.toLowerCase().includes('phonetics'))).toBeTrue();
  });

  it('should render articles dynamically', () => {
    // Check if the component renders the articles dynamically
    const articlesList = fixture.nativeElement.querySelectorAll('.article');
    expect(articlesList.length).toBe(component.filteredArticles.length);
  });

  it('should display "No articles found" when no articles match the search query', () => {
    component.searchQuery = 'NonExistingArticle';
    component.filterArticles();
    fixture.detectChanges();

    const noArticlesMessage = fixture.nativeElement.querySelector('.articles-list').textContent;
    expect(noArticlesMessage).toContain('No articles found.');
  });
});
