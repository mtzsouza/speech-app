import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PTUEComponent } from './ptue.component';

describe('PTUEComponent', () => {
  let component: PTUEComponent;
  let fixture: ComponentFixture<PTUEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PTUEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PTUEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
