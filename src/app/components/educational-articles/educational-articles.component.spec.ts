import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationalArticlesComponent } from './educational-articles.component';
import { NavbarComponent } from '../navbar/navbar.component';

describe('EducationalArticlesComponent', () => {
  let component: EducationalArticlesComponent;
  let fixture: ComponentFixture<EducationalArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationalArticlesComponent, NavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationalArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
