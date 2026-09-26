import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, UserSession } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api';
  private readonly tokenKey = 'acme_salary_token';
  private readonly userKey = 'acme_salary_user';
  private readonly userSubject = new BehaviorSubject<UserSession | null>(this.readUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response) => {
        sessionStorage.setItem(this.tokenKey, response.token);
        sessionStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.userSubject.next(response.user);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  get token(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  get user(): UserSession | null {
    return this.userSubject.value;
  }

  canEdit(): boolean {
    return this.user?.role === 'ADMIN' || this.user?.role === 'HR_MANAGER';
  }

  canDelete(): boolean {
    return this.user?.role === 'ADMIN';
  }

  private readUser(): UserSession | null {
    const savedUser = sessionStorage.getItem(this.userKey);
    if (!savedUser) {
      return null;
    }
    try {
      return JSON.parse(savedUser) as UserSession;
    } catch {
      sessionStorage.removeItem(this.userKey);
      return null;
    }
  }
}
