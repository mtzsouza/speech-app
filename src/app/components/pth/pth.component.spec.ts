import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PTHComponent } from './pth.component';

describe('PTHComponent', () => {
  let component: PTHComponent;
  let fixture: ComponentFixture<PTHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PTHComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PTHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
