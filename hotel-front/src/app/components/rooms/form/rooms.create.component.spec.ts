import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomComponent } from './rooms.create.component';

describe('RoomsFormComponent', () => {
  let component: RoomsFormComponent;
  let fixture: ComponentFixture<RoomsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoomsFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
