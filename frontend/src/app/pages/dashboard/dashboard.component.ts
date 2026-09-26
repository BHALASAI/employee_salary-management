import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardSummary, Metric } from '../../core/models';
import { EmployeeService } from '../../core/employee.service';

@Component({
  standalone: true,
  imports: [DecimalPipe, NgIf, NgFor, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <main class="dashboard page-content">
      <section class="page-heading">
        <div><p class="eyebrow">PEOPLE OPERATIONS / OVERVIEW</p><h1>Salary office</h1><p class="lede">A clear view of headcount, pay, and where the organization is growing.</p></div>
        <a mat-flat-button color="primary" routerLink="/employees"><mat-icon>manage_search</mat-icon> Open employee ledger</a>
      </section>
      <div *ngIf="loading" class="loading"><mat-spinner diameter="42"></mat-spinner></div>
      <p *ngIf="errorMessage" class="error-message">{{ errorMessage }}</p>
      <ng-container *ngIf="summary as data">
        <section class="stat-grid" aria-label="Key salary metrics">
          <article class="stat-card accent"><span class="stat-label">Total headcount</span><strong>{{ data.headcount | number }}</strong><span class="stat-caption">All employee records</span></article>
          <article class="stat-card"><span class="stat-label">Active employees</span><strong>{{ data.activeHeadcount | number }}</strong><span class="stat-caption">{{ activeRate(data) }}% of headcount</span></article>
          <article class="stat-card"><span class="stat-label">Avg base salary</span><strong>{{ formatNumber(data.averageBaseSalary) }}</strong><span class="stat-caption">Local currency units</span></article>
          <article class="stat-card"><span class="stat-label">Avg bonus</span><strong>{{ formatNumber(data.averageBonus) }}</strong><span class="stat-caption">Local currency units</span></article>
        </section>
        <section class="insight-grid">
          <article class="panel payroll-panel">
            <div class="panel-heading"><div><p class="eyebrow">PAYROLL LENS</p><h2>Base salary by currency</h2></div><mat-icon>public</mat-icon></div>
            <p class="panel-note">Totals remain separated by currency to avoid misleading cross-country comparisons.</p>
            <div class="currency-list"><div class="currency-row" *ngFor="let item of data.byCurrency"><div class="currency-badge">{{ item.currency }}</div><div class="currency-copy"><strong>{{ formatNumber(item.totalBaseSalary) }}</strong><span>{{ item.employeeCount | number }} employees</span></div><div class="currency-bar"><span [style.width.%]="currencyShare(item.employeeCount, data.headcount)"></span></div></div></div>
          </article>
          <article class="panel"><div class="panel-heading"><div><p class="eyebrow">ORGANIZATION</p><h2>Headcount by department</h2></div><mat-icon>account_tree</mat-icon></div><div class="metric-list"><div class="metric-row" *ngFor="let item of data.byDepartment"><div class="metric-label"><span>{{ item.label }}</span><strong>{{ item.employeeCount | number }}</strong></div><div class="metric-track"><span [style.width.%]="metricShare(item, data.byDepartment)"></span></div></div></div></article>
        </section>
        <section class="panel country-panel"><div class="panel-heading"><div><p class="eyebrow">GLOBAL FOOTPRINT</p><h2>Headcount by country</h2></div><mat-icon>location_on</mat-icon></div><div class="country-grid"><div class="country-item" *ngFor="let item of data.byCountry"><span>{{ item.label }}</span><strong>{{ item.employeeCount | number }}</strong></div></div></section>
      </ng-container>
    </main>
  `,
  styles: [`
    .page-content { max-width: 1380px; margin: 0 auto; padding: 58px 5vw 80px; }
    .page-heading { display: flex; align-items: end; justify-content: space-between; gap: 28px; margin-bottom: 40px; }
    .page-heading h1, h2 { font-family: 'Space Grotesk', sans-serif; letter-spacing: -.035em; }
    .page-heading h1 { margin: 0; font-size: clamp(38px, 5vw, 62px); line-height: .95; }
    .lede { max-width: 540px; margin: 16px 0 0; color: var(--muted); line-height: 1.55; }
    .eyebrow { color: var(--coral-deep); font-size: 10px; letter-spacing: .15em; font-weight: 700; margin: 0 0 10px; }
    .page-heading a { background: var(--ink); color: #fff; height: 47px; }
    .page-heading mat-icon { margin-right: 8px; }
    .loading { display: grid; place-items: center; min-height: 280px; }
    .error-message { color: #b43c32; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 34px; }
    .stat-card { min-height: 148px; padding: 22px; background: #fff; border-top: 3px solid var(--teal); box-shadow: 0 5px 20px rgba(24,35,43,.06); }
    .stat-card.accent { border-top-color: var(--coral); }
    .stat-card span, .stat-card strong { display: block; }
    .stat-label { color: var(--muted); font-size: 12px; }
    .stat-card strong { margin: 20px 0 7px; font-family: 'Space Grotesk', sans-serif; font-size: 32px; letter-spacing: -.04em; }
    .stat-caption { color: #8a9896; font-size: 11px; }
    .insight-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 14px; margin-bottom: 14px; }
    .panel { padding: 26px; background: #fff; box-shadow: 0 5px 20px rgba(24,35,43,.06); }
    .panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; }
    .panel-heading h2 { margin: 0; font-size: 22px; }
    .panel-heading > mat-icon { color: var(--teal); }
    .panel-note { color: var(--muted); font-size: 12px; line-height: 1.5; margin: 10px 0 24px; }
    .currency-list { display: grid; gap: 20px; }
    .currency-row { display: grid; grid-template-columns: 42px 1fr 120px; align-items: center; gap: 14px; }
    .currency-badge { display: grid; place-items: center; width: 40px; height: 40px; background: #e7f2ef; color: var(--teal); font-size: 11px; font-weight: 700; }
    .currency-copy strong, .currency-copy span { display: block; }
    .currency-copy strong { font-size: 14px; }
    .currency-copy span { color: var(--muted); font-size: 11px; margin-top: 4px; }
    .currency-bar, .metric-track { height: 6px; background: #edf0ed; overflow: hidden; }
    .currency-bar span, .metric-track span { display: block; height: 100%; background: var(--coral); }
    .metric-list { display: grid; gap: 18px; margin-top: 29px; }
    .metric-label { display: flex; justify-content: space-between; gap: 15px; font-size: 12px; margin-bottom: 7px; }
    .metric-label strong { color: var(--ink); }
    .metric-track span { background: var(--teal); }
    .country-panel { margin-bottom: 14px; }
    .country-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 24px; background: var(--line); }
    .country-item { display: flex; justify-content: space-between; gap: 10px; padding: 15px; background: #fff; font-size: 12px; }
    .country-item strong { color: var(--teal); }
    @media (max-width: 950px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } .insight-grid { grid-template-columns: 1fr; } }
    @media (max-width: 600px) { .page-content { padding: 38px 18px 60px; } .page-heading { align-items: flex-start; flex-direction: column; } .page-heading a { width: 100%; } .stat-grid { gap: 9px; } .stat-card { padding: 16px; min-height: 125px; } .stat-card strong { font-size: 24px; margin-top: 16px; } .panel { padding: 19px; } .country-grid { grid-template-columns: repeat(2, 1fr); } .currency-row { grid-template-columns: 40px 1fr; } .currency-bar { grid-column: 2; width: 100%; } }
  `]
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  loading = true;
  errorMessage = '';

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.summary().subscribe({
      next: (summary) => { this.summary = summary; this.loading = false; },
      error: () => { this.errorMessage = 'Dashboard data could not be loaded.'; this.loading = false; }
    });
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  activeRate(summary: DashboardSummary): string {
    return summary.headcount ? ((summary.activeHeadcount / summary.headcount) * 100).toFixed(1) : '0.0';
  }

  currencyShare(count: number, headcount: number): number {
    return headcount ? Math.max(7, (count / headcount) * 100) : 0;
  }

  metricShare(metric: Metric, metrics: Metric[]): number {
    const maximum = Math.max(...metrics.map((item) => item.employeeCount), 1);
    return (metric.employeeCount / maximum) * 100;
  }
}
