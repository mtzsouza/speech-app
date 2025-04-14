import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechWalkComponent } from './speech-walk.component';

describe('SpeechWalkComponent', () => {
  let component: SpeechWalkComponent;
  let fixture: ComponentFixture<SpeechWalkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeechWalkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpeechWalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
