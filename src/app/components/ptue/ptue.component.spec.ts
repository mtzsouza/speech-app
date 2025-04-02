import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { PTUEComponent } from './ptue.component';

describe('PTUEComponent', () => {
  let component: PTUEComponent;
  let fixture: ComponentFixture<PTUEComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PTUEComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PTUEComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should navigate to progress page when back button is clicked', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const backButton = fixture.nativeElement.querySelector('.back-link');
    
    backButton.click();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/progress']);
  });
});
