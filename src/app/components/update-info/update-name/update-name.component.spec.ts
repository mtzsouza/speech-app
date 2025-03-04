import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNameComponent } from './update-name.component';

describe('UpdateNameComponent', () => {
  let component: UpdateNameComponent;
  let fixture: ComponentFixture<UpdateNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
