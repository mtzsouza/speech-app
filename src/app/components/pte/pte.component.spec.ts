import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PTEComponent } from './pte.component';

describe('PTEComponent', () => {
  let component: PTEComponent;
  let fixture: ComponentFixture<PTEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PTEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
