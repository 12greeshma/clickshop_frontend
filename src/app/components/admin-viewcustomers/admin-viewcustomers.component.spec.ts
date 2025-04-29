import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewcustomersComponent } from './admin-viewcustomers.component';

describe('AdminViewcustomersComponent', () => {
  let component: AdminViewcustomersComponent;
  let fixture: ComponentFixture<AdminViewcustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminViewcustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewcustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
