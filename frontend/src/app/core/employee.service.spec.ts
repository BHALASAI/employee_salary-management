import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [EmployeeService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(EmployeeService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends server-side filters and pagination', () => {
    service.list({ search: 'Patel', country: 'France', department: '', active: true, page: 2, size: 25 }).subscribe();
    const request = http.expectOne((candidate) => candidate.url === '/api/employees');
    expect(request.request.params.get('search')).toBe('Patel');
    expect(request.request.params.get('country')).toBe('France');
    expect(request.request.params.get('active')).toBe('true');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('25');
    request.flush({ content: [], page: 2, size: 25, totalElements: 0, totalPages: 0 });
  });
});
