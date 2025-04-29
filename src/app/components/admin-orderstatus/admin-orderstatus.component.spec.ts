import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderstatusComponent } from './admin-orderstatus.component';

describe('AdminOrderstatusComponent', () => {
  let component: AdminOrderstatusComponent;
  let fixture: ComponentFixture<AdminOrderstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminOrderstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrderstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
