import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  template: `
    <main class="login-page">
      <section class="login-intro">
        <div class="intro-kicker">ACME / PEOPLE OPERATIONS</div>
        <h1>Know how your organization pays people.</h1>
        <p>A focused salary workspace for clear decisions across teams, countries, and currencies.</p>
        <div class="intro-note"><span class="note-line"></span><span>10,000 employee records, one calm source of truth.</span></div>
      </section>
      <section class="login-panel">
        <div class="panel-heading"><span class="brand-mark">A</span><div><strong>Salary office</strong><span>HR manager access</span></div></div>
        <h2>Welcome back</h2>
        <p class="muted">Sign in to continue to the people ledger.</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline"><mat-label>Username</mat-label><input matInput formControlName="username" autocomplete="username"><mat-error>Enter your username.</mat-error></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Password</mat-label><input matInput type="password" formControlName="password" autocomplete="current-password"><mat-error>Enter your password.</mat-error></mat-form-field>
          <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
          <button mat-flat-button class="login-button" type="submit" [disabled]="form.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="19"></mat-spinner><span *ngIf="!loading">Sign in</span>
          </button>
        </form>
        <div class="demo-hint"><span>Demo access</span><strong>hrmanager / hrmanager123!</strong></div>
      </section>
    </main>
  `,
  styles: [`
    .login-page { min-height: 100vh; display: grid; grid-template-columns: 1.05fr .95fr; background: var(--paper); }
    .login-intro { display: flex; flex-direction: column; justify-content: center; padding: 8vw; background: var(--ink); color: #fff; position: relative; overflow: hidden; }
    .login-intro::after { content: ''; width: 340px; height: 340px; border: 1px solid rgba(255,255,255,.14); position: absolute; right: -120px; bottom: -120px; transform: rotate(18deg); }
    .intro-kicker { color: var(--coral); font-size: 11px; letter-spacing: .18em; font-weight: 700; margin-bottom: 28px; }
    h1 { max-width: 620px; margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(42px, 5vw, 76px); line-height: .98; letter-spacing: -.04em; }
    .login-intro p { max-width: 430px; color: #afbfbd; font-size: 17px; line-height: 1.6; margin: 30px 0 0; }
    .intro-note { display: flex; gap: 13px; align-items: center; margin-top: 66px; color: #dce4e1; font-size: 12px; }
    .note-line { width: 36px; height: 2px; background: var(--coral); }
    .login-panel { align-self: center; width: min(420px, calc(100% - 44px)); margin: auto; }
    .panel-heading { display: flex; align-items: center; gap: 12px; margin-bottom: 70px; }
    .panel-heading > div span, .panel-heading > div strong { display: block; }
    .panel-heading strong { font-family: 'Space Grotesk', sans-serif; font-size: 15px; }
    .panel-heading span:not(.brand-mark) { color: var(--muted); font-size: 11px; margin-top: 3px; }
    .brand-mark { display: grid; place-items: center; width: 38px; height: 38px; background: var(--coral); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; }
    h2 { margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 34px; letter-spacing: -.03em; }
    .muted { color: var(--muted); margin: 8px 0 30px; font-size: 14px; }
    form { display: grid; gap: 4px; }
    .login-button { min-height: 50px; background: var(--teal) !important; color: #fff !important; margin-top: 7px; font-weight: 700; letter-spacing: .01em; }
    .login-button mat-spinner { margin: auto; }
    .error-message { min-height: 18px; color: #ba3b32; font-size: 12px; margin: 0; }
    .demo-hint { display: flex; justify-content: space-between; gap: 15px; margin-top: 28px; padding-top: 17px; border-top: 1px solid var(--line); color: var(--muted); font-size: 11px; }
    .demo-hint strong { color: var(--ink); font-weight: 600; }
    @media (max-width: 800px) { .login-page { grid-template-columns: 1fr; } .login-intro { min-height: 360px; padding: 50px 28px; } .login-intro h1 { font-size: 47px; } .intro-note { margin-top: 32px; } .login-panel { padding: 50px 0; } .panel-heading { margin-bottom: 42px; } }
  `]
})
export class LoginComponent {
  readonly form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  loading = false;
  errorMessage = '';

  constructor(private readonly formBuilder: FormBuilder, private readonly authService: AuthService, private readonly router: Router) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    const { username, password } = this.form.getRawValue();
    this.authService.login(username, password).subscribe({
      next: () => void this.router.navigate(['/dashboard']),
      error: () => { this.loading = false; this.errorMessage = 'The username or password was not recognized.'; }
    });
  }
}
