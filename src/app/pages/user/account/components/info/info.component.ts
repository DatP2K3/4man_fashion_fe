import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile } from '@app/core/models/Profile.model';
import { ProfileService } from '@app/core/services/Profile.service';
import { AppStateService } from '@app/shared/state/AppState.service';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent implements OnInit {
  infoForm!: FormGroup;
  public profile: Profile | null = null;

  constructor(
    private fb: FormBuilder,
    private appState: AppStateService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.infoForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      dob: [''],
    });

    this.appState.profile$.subscribe(
      (profile) => {
        this.profile = profile;
      } // Lưu giá trị profile nhận được vào biến
    );

    // Kiểm tra nếu profile có dữ liệu, thì gán giá trị vào form
    this.appState.profile$.subscribe((profile) => {
      this.profile = profile;

      // Kiểm tra và cập nhật form SAU KHI có dữ liệu
      if (profile) {
        this.infoForm.patchValue({
          email: profile?.email,
          firstName: profile?.firstName,
          lastName: profile?.lastName,
          phoneNumber: profile?.phoneNumber,
          dob: profile.dob ? new Date(profile.dob) : undefined,
        });

        // Đánh dấu là đã touch để hiệu ứng float label hoạt động
        Object.keys(this.infoForm.controls).forEach((key) => {
          this.infoForm.get(key)?.markAsDirty();
          this.infoForm.get(key)?.markAsTouched();
        });
      }
    });
  }

  onSubmit() {
    const formData = this.infoForm.value;

    // Xử lý ngày tháng đúng múi giờ
    let dobFormatted = null;
    if (formData.dob) {
      const date = new Date(formData.dob);
      // Lấy ngày, tháng, năm theo múi giờ địa phương
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 vì tháng bắt đầu từ 0
      const day = String(date.getDate()).padStart(2, '0');
      dobFormatted = `${year}-${month}-${day}`;
    }

    const updateData = {
      id: this.profile?.id,
      ...formData,
      dob: dobFormatted,
    };

    console.log('Update data:', updateData);

    this.profileService.updateInfo(updateData).subscribe((response) => {
      console.log('Profile updated successfully:', response);
      // Cập nhật lại profile trong state
      this.appState.updateProfile(response.data);
      this.profile = response.data;
      this.infoForm.patchValue({
        email: this.profile?.email,
        firstName: this.profile?.firstName,
        lastName: this.profile?.lastName,
        phoneNumber: this.profile?.phoneNumber,
        dob: this.profile?.dob ? new Date(this.profile.dob) : undefined,
      });
    });
  }
}
