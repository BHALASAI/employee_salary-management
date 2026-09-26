import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { Employee, PageResponse } from '../../core/models';
import { EmployeeService } from '../../core/employee.service';

@Component({
  standalone: true,
  imports: [DecimalPipe, NgIf, NgFor, RouterLink, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule],
  template: `
    <main class="page-content">
      <section class="page-heading"><div><p class="eyebrow">PEOPLE OPERATIONS / LEDGER</p><h1>Employees</h1><p class="lede">Search and maintain the organization salary register.</p></div><a *ngIf="authService.canEdit()" mat-flat-button class="primary-action" routerLink="/employees/new"><mat-icon>add</mat-icon> Add employee</a></section>
      <section class="filter-bar"><form [formGroup]="filters" (ngSubmit)="applyFilters()"><mat-form-field appearance="outline" class="search-field"><mat-label>Search people</mat-label><mat-icon matPrefix>search</mat-icon><input matInput formControlName="search" placeholder="Name, ID, email, title"></mat-form-field><mat-form-field appearance="outline"><mat-label>Country</mat-label><mat-select formControlName="country"><mat-option value="">All countries</mat-option><mat-option *ngFor="let country of countries" [value]="country">{{ country }}</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>Department</mat-label><mat-select formControlName="department"><mat-option value="">All departments</mat-option><mat-option *ngFor="let department of departments" [value]="department">{{ department }}</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select formControlName="active"><mat-option value="all">All statuses</mat-option><mat-option value="true">Active</mat-option><mat-option value="false">Inactive</mat-option></mat-select></mat-form-field><button mat-flat-button class="filter-button" type="submit">Apply filters</button><button mat-button type="button" class="clear-button" (click)="clearFilters()">Clear</button></form></section>
      <section class="table-panel"><div class="table-header"><div><strong>{{ page?.totalElements | number }} employees</strong><span>Showing page {{ currentPage + 1 }} of {{ page?.totalPages || 1 }}</span></div><mat-spinner *ngIf="loading" diameter="26"></mat-spinner></div><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Role / team</th><th>Location</th><th>Base salary</th><th>Bonus</th><th>Status</th><th class="actions-heading">Actions</th></tr></thead><tbody><tr *ngFor="let employee of page?.content"><td><div class="person-cell"><span class="avatar">{{ initials(employee) }}</span><div><strong>{{ employee.firstName }} {{ employee.lastName }}</strong><span>{{ employee.employeeId }} &middot; {{ employee.email }}</span></div></div></td><td><strong>{{ employee.jobTitle }}</strong><span class="cell-subtext">{{ employee.department }}</span></td><td>{{ employee.country }}<span class="cell-subtext">{{ employee.currency }}</span></td><td class="money">{{ money(employee.baseSalary, employee.currency) }}</td><td class="money">{{ money(employee.bonus, employee.currency) }}</td><td><span class="status" [class.inactive]="!employee.active">{{ employee.active ? 'Active' : 'Inactive' }}</span></td><td class="actions"><a mat-icon-button [routerLink]="['/employees', employee.id, 'edit']" aria-label="Edit employee" title="Edit employee" *ngIf="authService.canEdit()"><mat-icon>edit</mat-icon></a><button mat-icon-button aria-label="Delete employee" title="Delete employee" *ngIf="authService.canDelete()" (click)="remove(employee)"><mat-icon>delete_outline</mat-icon></button></td></tr><tr *ngIf="!loading && page?.content?.length === 0"><td colspan="7" class="empty-state"><mat-icon>search_off</mat-icon><strong>No employees match these filters.</strong><span>Try a broader search or clear the filters.</span></td></tr></tbody></table></div><mat-paginator [length]="page?.totalElements || 0" [pageSize]="pageSize" [pageIndex]="currentPage" [pageSizeOptions]="[10, 25, 50]" (page)="pageChanged($event)" aria-label="Employee pages"></mat-paginator></section>
    </main>
  `,
  styles: [`
    .page-content { max-width: 1440px; margin: 0 auto; padding: 58px 5vw 80px; }
    .page-heading { display: flex; justify-content: space-between; align-items: end; gap: 25px; margin-bottom: 35px; }
    .page-heading h1 { margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(38px, 5vw, 62px); line-height: .95; letter-spacing: -.04em; }
    .eyebrow { color: var(--coral-deep); font-size: 10px; letter-spacing: .15em; font-weight: 700; margin: 0 0 10px; }
    .lede { color: var(--muted); margin: 16px 0 0; }
    .primary-action, .filter-button { background: var(--ink) !important; color: #fff !important; height: 47px; }
    .filter-bar { padding: 16px 18px 4px; background: #fff; box-shadow: 0 5px 20px rgba(24,35,43,.06); margin-bottom: 18px; }
    .filter-bar form { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    mat-form-field { width: 170px; }
    .search-field { flex: 1 1 270px; }
    .filter-button { margin-bottom: 18px; }
    .clear-button { margin-bottom: 18px; color: var(--muted); }
    .table-panel { background: #fff; box-shadow: 0 5px 20px rgba(24,35,43,.06); }
    .table-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--line); }
    .table-header strong, .table-header span { display: block; }
    .table-header strong { font-family: 'Space Grotesk', sans-serif; font-size: 18px; }
    .table-header span { color: var(--muted); font-size: 12px; margin-top: 4px; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 960px; }
    th { color: var(--muted); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; text-align: left; font-weight: 700; padding: 15px 16px; background: #fafbf9; }
    td { padding: 15px 16px; border-top: 1px solid var(--line); color: #3f4d4d; font-size: 12px; vertical-align: middle; }
    tbody tr:hover { background: #fcf7f1; }
    td strong, td span { display: block; }
    td strong { color: var(--ink); font-size: 12px; }
    .person-cell { display: flex; align-items: center; gap: 11px; min-width: 235px; }
    .person-cell span:not(.avatar), .cell-subtext { color: var(--muted); font-size: 11px; margin-top: 5px; }
    .avatar { display: grid; place-items: center; flex: 0 0 34px; width: 34px; height: 34px; background: #f9d6ca; color: #a24b39; font-size: 11px; font-weight: 700; }
    .money { color: var(--ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
    .status { width: max-content; padding: 5px 9px; background: #e1f2ec; color: #177067; font-size: 10px !important; font-weight: 700; }
    .status.inactive { background: #f6e8d2; color: #9a6a28; }
    .actions { white-space: nowrap; text-align: right; }
    .actions button, .actions a { color: var(--teal); }
    .actions button:last-child { color: #ba4a3e; }
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-state mat-icon, .empty-state strong, .empty-state span { margin: 0 auto 8px; }
    .empty-state mat-icon { color: var(--teal); }
    .empty-state strong { font-size: 15px; }
    .empty-state span { color: var(--muted); }
    mat-paginator { border-top: 1px solid var(--line); }
    @media (max-width: 650px) { .page-content { padding: 38px 18px 60px; } .page-heading { align-items: flex-start; flex-direction: column; } .page-heading a { width: 100%; } .filter-bar { padding: 16px 16px 3px; } mat-form-field, .search-field { width: 100%; flex-basis: 100%; } .filter-button { flex: 1; } }
  `]
})
export class EmployeesComponent implements OnInit {
  readonly countries = ['France', 'India', 'United States', 'United Kingdom', 'Germany', 'Japan', 'Brazil', 'Canada'];
  readonly departments = ['Engineering', 'People', 'Finance', 'Operations', 'Sales', 'Legal', 'Marketing', 'Customer Success'];
  readonly filters = this.formBuilder.nonNullable.group({ search: '', country: '', department: '', active: 'all' });
  page: PageResponse<Employee> | null = null;
  currentPage = 0;
  pageSize = 25;
  loading = false;

  constructor(public readonly authService: AuthService, private readonly formBuilder: FormBuilder, private readonly employeeService: EmployeeService, private readonly router: Router, private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    const values = this.filters.getRawValue();
    const active = values.active === 'all' ? null : values.active === 'true';
    this.employeeService.list({ ...values, active, page: this.currentPage, size: this.pageSize }).subscribe({ next: (page) => { this.page = page; this.loading = false; }, error: () => { this.loading = false; this.snackBar.open('Employee records could not be loaded.', 'Dismiss', { duration: 3500 }); } });
  }

  applyFilters(): void { this.currentPage = 0; this.load(); }
  clearFilters(): void { this.filters.reset({ search: '', country: '', department: '', active: 'all' }); this.applyFilters(); }
  pageChanged(event: PageEvent): void { this.currentPage = event.pageIndex; this.pageSize = event.pageSize; this.load(); }
  initials(employee: Employee): string { return `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase(); }
  money(value: number, currency: string): string { return `${currency} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`; }

  remove(employee: Employee): void {
    if (!window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`)) return;
    this.employeeService.delete(employee.id).subscribe({ next: () => { this.snackBar.open('Employee deleted.', 'Dismiss', { duration: 2500 }); this.load(); }, error: () => this.snackBar.open('Employee could not be deleted.', 'Dismiss', { duration: 3500 }) });
  }
}
