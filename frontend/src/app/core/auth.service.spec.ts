import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [AuthService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('stores the authenticated user and token after login', () => {
    service.login('viewer', 'viewer123!').subscribe((response) => {
      expect(response.user.role).toBe('VIEWER');
      expect(service.token).toBe('token');
      expect(service.user?.username).toBe('viewer');
    });
    const request = http.expectOne('/api/auth/login');
    expect(request.request.method).toBe('POST');
    request.flush({ token: 'token', user: { username: 'viewer', role: 'VIEWER' } });
  });
});
