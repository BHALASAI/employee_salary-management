import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { EmployeePayload } from '../../core/models';
import { EmployeeService } from '../../core/employee.service';

@Component({
  standalone: true,
  imports: [NgIf, RouterLink, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule],
  template: `
    <main class="page-content"><a class="back-link" routerLink="/employees">Back to employees</a><section class="form-heading"><div><p class="eyebrow">PEOPLE OPERATIONS / RECORD</p><h1>{{ isEdit ? 'Edit employee' : 'Add employee' }}</h1><p class="lede">Keep identity, organization, and pay details in one validated record.</p></div><span class="record-state" *ngIf="isEdit">Editing existing record</span></section><form class="employee-form" [formGroup]="form" (ngSubmit)="save()"><section class="form-section"><div class="section-title"><span>01</span><div><h2>Identity</h2><p>How this person appears in the organization.</p></div></div><div class="field-grid"><mat-form-field appearance="outline"><mat-label>Employee ID</mat-label><input matInput formControlName="employeeId"><mat-error>Employee ID is required.</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" formControlName="email"><mat-error>Enter a valid email.</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>First name</mat-label><input matInput formControlName="firstName"><mat-error>First name is required.</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>Last name</mat-label><input matInput formControlName="lastName"><mat-error>Last name is required.</mat-error></mat-form-field></div></section><section class="form-section"><div class="section-title"><span>02</span><div><h2>Organization</h2><p>The team and geography around the role.</p></div></div><div class="field-grid"><mat-form-field appearance="outline"><mat-label>Job title</mat-label><input matInput formControlName="jobTitle"><mat-error>Job title is required.</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>Department</mat-label><mat-select formControlName="department"><mat-option *ngFor="let item of departments" [value]="item">{{ item }}</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>Country</mat-label><mat-select formControlName="country"><mat-option *ngFor="let item of countries" [value]="item">{{ item }}</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select formControlName="active"><mat-option [value]="true">Active</mat-option><mat-option [value]="false">Inactive</mat-option></mat-select></mat-form-field></div></section><section class="form-section"><div class="section-title"><span>03</span><div><h2>Compensation</h2><p>Salary values remain associated with the employee currency.</p></div></div><div class="field-grid"><mat-form-field appearance="outline"><mat-label>Currency</mat-label><mat-select formControlName="currency"><mat-option *ngFor="let item of currencies" [value]="item">{{ item }}</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>Base salary</mat-label><input matInput type="number" min="0" formControlName="baseSalary"><mat-error>Enter a non-negative amount.</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>Bonus</mat-label><input matInput type="number" min="0" formControlName="bonus"><mat-error>Enter a non-negative amount.</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>Effective date</mat-label><input matInput type="date" formControlName="effectiveDate"><mat-error>Choose today or an earlier date.</mat-error></mat-form-field></div></section><p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p><div class="form-actions"><a mat-button routerLink="/employees">Cancel</a><button mat-flat-button class="save-button" type="submit" [disabled]="form.invalid || saving"><mat-spinner *ngIf="saving" diameter="19"></mat-spinner><span *ngIf="!saving">{{ isEdit ? 'Save changes' : 'Create employee' }}</span></button></div></form></main>
  `,
  styles: [`
    .page-content { max-width: 1120px; margin: 0 auto; padding: 48px 5vw 80px; }
    .back-link { display: inline-block; color: var(--muted); font-size: 12px; text-decoration: none; margin-bottom: 34px; }
    .back-link:hover { color: var(--teal); }
    .form-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 42px; }
    .form-heading h1 { margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(38px, 5vw, 60px); letter-spacing: -.04em; line-height: .95; }
    .eyebrow { color: var(--coral-deep); font-size: 10px; letter-spacing: .15em; font-weight: 700; margin: 0 0 10px; }
    .lede { color: var(--muted); margin: 16px 0 0; }
    .record-state { padding: 8px 12px; background: #e1f2ec; color: #177067; font-size: 11px; font-weight: 700; }
    .employee-form { background: #fff; box-shadow: 0 5px 20px rgba(24,35,43,.06); }
    .form-section { padding: 32px; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 210px 1fr; gap: 30px; }
    .section-title { display: flex; align-items: flex-start; gap: 12px; }
    .section-title > span { color: var(--coral); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; }
    .section-title h2 { margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 20px; }
    .section-title p { max-width: 180px; color: var(--muted); font-size: 11px; line-height: 1.45; margin: 8px 0 0; }
    .field-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px 14px; }
    .form-actions { display: flex; justify-content: flex-end; align-items: center; gap: 12px; padding: 20px 32px; }
    .save-button { min-width: 150px; height: 45px; background: var(--teal) !important; color: #fff !important; }
    .save-button mat-spinner { margin: auto; }
    .error-message { color: #b43c32; font-size: 12px; padding: 15px 32px 0; }
    @media (max-width: 750px) { .page-content { padding: 38px 18px 60px; } .form-heading { align-items: flex-start; flex-direction: column; } .form-section { padding: 25px 20px; grid-template-columns: 1fr; gap: 16px; } .section-title p { max-width: none; } .field-grid { grid-template-columns: 1fr; } .form-actions { padding: 18px 20px; } }
  `]
})
export class EmployeeFormComponent implements OnInit {
  readonly countries = ['France', 'India', 'United States', 'United Kingdom', 'Germany', 'Japan', 'Brazil', 'Canada'];
  readonly departments = ['Engineering', 'People', 'Finance', 'Operations', 'Sales', 'Legal', 'Marketing', 'Customer Success'];
  readonly currencies = ['EUR', 'INR', 'USD', 'GBP', 'JPY', 'BRL', 'CAD'];
  readonly form = this.formBuilder.nonNullable.group({ employeeId: ['', Validators.required], firstName: ['', Validators.required], lastName: ['', Validators.required], email: ['', [Validators.required, Validators.email]], department: ['Engineering', Validators.required], jobTitle: ['', Validators.required], country: ['France', Validators.required], currency: ['EUR', Validators.required], baseSalary: [0, [Validators.required, Validators.min(0)]], bonus: [0, [Validators.required, Validators.min(0)]], effectiveDate: [new Date().toISOString().slice(0, 10), Validators.required], active: [true, Validators.required] });
  isEdit = false;
  employeeId = 0;
  saving = false;
  errorMessage = '';

  constructor(private readonly formBuilder: FormBuilder, private readonly route: ActivatedRoute, private readonly router: Router, private readonly employeeService: EmployeeService, private readonly snackBar: MatSnackBar, private readonly authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.canEdit()) { void this.router.navigate(['/employees']); return; }
    const routeId = this.route.snapshot.paramMap.get('id');
    if (!routeId) return;
    this.isEdit = true;
    this.employeeId = Number(routeId);
    this.employeeService.get(this.employeeId).subscribe({ next: (employee) => this.form.patchValue(employee), error: () => { this.errorMessage = 'Employee record could not be loaded.'; } });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMessage = '';
    const payload = this.form.getRawValue() as EmployeePayload;
    const request = this.isEdit ? this.employeeService.update(this.employeeId, payload) : this.employeeService.create(payload);
    request.subscribe({ next: () => { this.snackBar.open(this.isEdit ? 'Changes saved.' : 'Employee created.', 'Dismiss', { duration: 2500 }); void this.router.navigate(['/employees']); }, error: (error: { error?: { message?: string } }) => { this.saving = false; this.errorMessage = error.error?.message || 'The employee could not be saved.'; } });
  }
}
