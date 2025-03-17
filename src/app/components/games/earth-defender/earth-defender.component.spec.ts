import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthDefenderComponent } from './earth-defender.component';

describe('Game2Component', () => {
  let component: EarthDefenderComponent;
  let fixture: ComponentFixture<EarthDefenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarthDefenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EarthDefenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
