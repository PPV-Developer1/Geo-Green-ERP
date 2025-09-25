/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Debit_note_viewComponent } from './debit_note_view.component';

describe('Debit_note_viewComponent', () => {
  let component: Debit_note_viewComponent;
  let fixture: ComponentFixture<Debit_note_viewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Debit_note_viewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Debit_note_viewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
