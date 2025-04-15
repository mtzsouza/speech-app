import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchMazeComponent } from './match-maze.component';

describe('MatchMazeComponent', () => {
  let component: MatchMazeComponent;
  let fixture: ComponentFixture<MatchMazeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchMazeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchMazeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
