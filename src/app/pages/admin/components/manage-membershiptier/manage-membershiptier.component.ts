import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MembershipTierService } from '@app/core/services/MembershipTier.service';
import { MembershipTier } from '@app/core/models/MembershipTier.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-manage-membershiptier',
  standalone: false,
  templateUrl: './manage-membershiptier.component.html',
  styleUrls: ['./manage-membershiptier.component.scss'],
})
export class ManageMembershipTierComponent implements OnInit {
  membershipTiers: MembershipTier[] = [];
  loading = false;
  displayDialog = false;
  editMode = false;
  membershipTierForm: FormGroup;
  selectedTier: MembershipTier | null = null;

  constructor(
    private membershipTierService: MembershipTierService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.membershipTierForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      cashbackPercentage: [0, [Validators.required, Validators.min(0)]],
      minPoints: [0, [Validators.required, Validators.min(0)]],
      deleted: [false],
      defaultTier: [false],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.membershipTierService.getAllMembershipTiers().subscribe({
      next: (res) => {
        this.membershipTiers = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách hạng thành viên',
          life: 2000,
        });
      },
    });
  }

  openNewDialog() {
    this.editMode = false;
    this.selectedTier = null;
    this.membershipTierForm.reset({
      cashbackPercentage: 0,
      minPoints: 0,
      deleted: false,
      defaultTier: false,
    });
    this.displayDialog = true;
  }

  openEditDialog(tier: MembershipTier) {
    this.editMode = true;
    this.selectedTier = tier;
    this.membershipTierForm.patchValue(tier);
    this.displayDialog = true;
  }

  saveMembershipTier() {
    if (this.membershipTierForm.invalid) return;
    const formValue = this.membershipTierForm.value;
    // Validate không cho nhập số âm (chặn cả khi nhập chuỗi hoặc null)
    if (this.editMode && formValue.id) {
      this.membershipTierService.updateMembershipTier(formValue).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật hạng thành viên thành công',
            life: 2000,
          });
          this.displayDialog = false;
          // Reload list after update
          this.loadMembershipTiers();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Cập nhật thất bại',
            life: 2000,
          });
        },
      });
    } else {
      this.membershipTierService.createMembershipTier(formValue).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tạo hạng thành viên thành công',
            life: 2000,
          });
          this.displayDialog = false;
          // Reload list after create
          this.loadMembershipTiers();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Tạo mới thất bại',
            life: 2000,
          });
        },
      });
    }
  }

  // Reload membership tiers list and update table
  loadMembershipTiers() {
    this.loading = true;
    this.membershipTierService.getAllMembershipTiers().subscribe({
      next: (res) => {
        this.membershipTiers = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách hạng thành viên',
          life: 2000,
        });
      },
    });
  }

  cancelDialog() {
    this.displayDialog = false;
  }

  toggleMembershipTierVisibility(tier: MembershipTier) {
    if (!tier.id) return;
    this.loading = true;
    this.membershipTierService
      .toggleMembershipTierVisibility(tier.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: tier.deleted
              ? 'Kích hoạt thành công'
              : 'Huỷ kích hoạt thành công',
            life: 2000,
          });
          this.membershipTierService.getAllMembershipTiers().subscribe({
            next: (res) => {
              this.membershipTiers = res.data || [];
              this.loading = false;
            },
            error: () => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tải danh sách hạng thành viên',
                life: 2000,
              });
            },
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể thay đổi trạng thái hạng thành viên',
            life: 2000,
          });
          this.loading = false;
        },
      });
  }
}
