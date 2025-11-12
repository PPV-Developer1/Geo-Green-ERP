/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Service_endComponent } from './service_end.component';

describe('Service_endComponent', () => {
  let component: Service_endComponent;
  let fixture: ComponentFixture<Service_endComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Service_endComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Service_endComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
