import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAlphaComponent } from './dashboard-alpha.component';

describe('DashboardAlphaComponent', () => {
  let component: DashboardAlphaComponent;
  let fixture: ComponentFixture<DashboardAlphaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAlphaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardAlphaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
