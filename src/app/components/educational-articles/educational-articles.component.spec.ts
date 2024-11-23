import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationalArticlesComponent } from './educational-articles.component';

describe('EducationalArticlesComponent', () => {
  let component: EducationalArticlesComponent;
  let fixture: ComponentFixture<EducationalArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationalArticlesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationalArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter articles based on search query', () => {
    component.searchQuery = 'Title 1';
    component.filterArticles();
    expect(component.filteredArticles.length).toBe(1);
    expect(component.filteredArticles[0].title).toBe('[Article Title 1]');
  });
});
