import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'acme-root',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  template: `
    <ng-container *ngIf="authService.user$ | async as user; else publicShell">
      <header class="topbar">
        <a class="brand" routerLink="/dashboard">
          <span class="brand-mark">A</span>
          <span><strong>ACME</strong><small>salary office</small></span>
        </a>
        <nav class="main-nav" aria-label="Main navigation">
          <a routerLink="/dashboard" routerLinkActive="active">Overview</a>
          <a routerLink="/employees" routerLinkActive="active">Employees</a>
        </nav>
        <div class="account">
          <div class="account-copy"><strong>{{ user.username }}</strong><span>{{ roleLabel(user.role) }}</span></div>
          <button mat-icon-button aria-label="Sign out" title="Sign out" (click)="logout()"><mat-icon>logout</mat-icon></button>
        </div>
      </header>
      <main class="page-shell"><router-outlet /></main>
    </ng-container>
    <ng-template #publicShell><router-outlet /></ng-template>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .topbar { min-height: 76px; display: flex; align-items: center; gap: 38px; padding: 0 5vw; background: var(--ink); color: #fff; }
    .brand { display: flex; align-items: center; gap: 11px; color: inherit; text-decoration: none; letter-spacing: .04em; }
    .brand-mark { display: grid; place-items: center; width: 36px; height: 36px; background: var(--coral); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; }
    .brand strong, .brand small { display: block; }
    .brand strong { font-family: 'Space Grotesk', sans-serif; font-size: 14px; }
    .brand small { color: #aab7b5; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; margin-top: 2px; }
    .main-nav { display: flex; gap: 24px; align-self: stretch; }
    .main-nav a { display: flex; align-items: center; border-bottom: 3px solid transparent; color: #aab7b5; font-size: 14px; text-decoration: none; }
    .main-nav a:hover, .main-nav a.active { color: #fff; border-bottom-color: var(--coral); }
    .account { display: flex; align-items: center; gap: 14px; margin-left: auto; }
    .account-copy { text-align: right; }
    .account-copy strong, .account-copy span { display: block; }
    .account-copy strong { font-size: 13px; }
    .account-copy span { color: #aab7b5; font-size: 11px; margin-top: 3px; }
    .account button { color: #fff; }
    .page-shell { min-height: calc(100vh - 76px); }
    @media (max-width: 700px) {
      .topbar { gap: 15px; padding: 0 18px; }
      .main-nav { gap: 12px; }
      .main-nav a { font-size: 12px; }
      .account-copy { display: none; }
    }
  `]
})
export class AppComponent {
  constructor(public readonly authService: AuthService, private readonly router: Router) {}

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  roleLabel(role: string): string {
    return role.replace('_', ' ');
  }
}
