import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardSummary, Employee, EmployeePayload, PageResponse } from './models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly apiUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  list(filters: { search?: string; country?: string; department?: string; active?: boolean | null; page: number; size: number }): Observable<PageResponse<Employee>> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('size', filters.size)
      .set('sort', 'lastName,asc');
    if (filters.search) params = params.set('search', filters.search);
    if (filters.country) params = params.set('country', filters.country);
    if (filters.department) params = params.set('department', filters.department);
    if (filters.active !== null && filters.active !== undefined) params = params.set('active', filters.active);
    return this.http.get<PageResponse<Employee>>(`${this.apiUrl}/employees`, { params });
  }

  get(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`);
  }

  create(payload: EmployeePayload): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees`, this.withoutEmployeeId(payload));
  }

  update(id: number, payload: EmployeePayload): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/employees/${id}`, this.withoutEmployeeId(payload));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employees/${id}`);
  }

  summary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/dashboard/summary`);
  }

  private withoutEmployeeId(payload: EmployeePayload): Omit<EmployeePayload, 'employeeId'> {
    const writePayload = { ...payload };
    delete (writePayload as Partial<EmployeePayload>).employeeId;
    return writePayload;
  }
}
