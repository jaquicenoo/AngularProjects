import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposanguineoComponent } from './gruposanguineo.component';

describe('GruposanguineoComponent', () => {
  let component: GruposanguineoComponent;
  let fixture: ComponentFixture<GruposanguineoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposanguineoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposanguineoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
