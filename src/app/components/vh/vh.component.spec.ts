import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHComponent } from './vh.component';

describe('VHComponent', () => {
  let component: VHComponent;
  let fixture: ComponentFixture<VHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VHComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
