import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PTDComponent } from './ptd.component';

describe('PTDComponent', () => {
  let component: PTDComponent;
  let fixture: ComponentFixture<PTDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PTDComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PTDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});