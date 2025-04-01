import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakingComponent } from './speaking.component';

describe('SpeakingComponent', () => {
  let component: SpeakingComponent;
  let fixture: ComponentFixture<SpeakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeakingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpeakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
