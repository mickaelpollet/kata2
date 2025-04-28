import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeycloakServerComponent } from './keycloak-server.component';

describe('KeycloakServerComponent', () => {
  let component: KeycloakServerComponent;
  let fixture: ComponentFixture<KeycloakServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeycloakServerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeycloakServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
