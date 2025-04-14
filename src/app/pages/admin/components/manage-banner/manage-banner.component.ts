import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Banner, BannerType } from '@app/core/models/Banner.model';
import { BannerService } from '@app/core/services/Banner.service';
import { FileUploadService } from '@app/core/services/FileUpload.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs'; // Add this import

// PrimeNG Imports
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Add this import
import { UUID } from 'node:crypto';
// Remove this import as it's causing the error
// import { console } from 'node:inspector';

@Component({
  selector: 'app-manage-banner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    FileUploadModule,
    ProgressSpinnerModule, // Add this module to the imports array
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage-banner.component.html',
  styleUrl: './manage-banner.component.scss',
})
export class ManageBannerComponent implements OnInit, OnDestroy {
  // Make BannerType available in template
  BannerType = BannerType;

  // Separate banner collections
  slideBanners: Banner[] = [];
  leftBanner: Banner | null = null;
  rightBanner: Banner | null = null;

  // Carousel control for slides
  activeSlideIndex: number = 0;

  // Properly declare all properties
  slides: Banner[] = [];
  mainBanners: Banner[] = [];
  bannerForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  displayDialog: boolean = false;
  dialogHeader: string = 'Thêm Banner mới';

  editMode = false;
  currentBannerId: string | null = null;

  bannerTypes = [
    { label: 'Slide (Banner chính)', value: BannerType.SLIDE },
    { label: 'Banner trái', value: BannerType.LEFT_BANNER },
    { label: 'Banner phải', value: BannerType.RIGHT_BANNER },
  ];

  loading: boolean = true;

  // Add properties for carousel functionality
  activeIndex: number = 0;
  bannerWidth: number = 0;
  visibleBanners: Banner[] = [];
  isSwiping: boolean = false;
  startX: number = 0;
  endX: number = 0;

  // Add placeholder banners
  placeholderBanners: Banner[] = [];
  showPlaceholders: boolean = false;

  constructor(
    private bannerService: BannerService,
    private uploadFileService: FileUploadService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.bannerForm = this.fb.group({
      title: ['', Validators.required],
      type: [BannerType.SLIDE, Validators.required],
      position: [0, Validators.required],
    });
  }

  ngOnInit() {
    this.loadAllBanners();
    this.initializePlaceholders();
    // Initialize resize handler for responsive carousel
    this.calculateBannerWidth();
    window.addEventListener('resize', this.calculateBannerWidth.bind(this));
  }

  ngOnDestroy() {
    // Clean up event listener
    window.removeEventListener('resize', this.calculateBannerWidth.bind(this));
  }

  // Calculate banner width for responsive carousel
  calculateBannerWidth() {
    const container = document.querySelector('.banner-carousel-container');
    if (container) {
      this.bannerWidth = container.clientWidth;
    }
  }

  // Carousel navigation methods
  nextBanner() {
    if (this.activeIndex < this.visibleBanners.length - 1) {
      this.activeIndex++;
    } else {
      this.activeIndex = 0; // Loop back to first banner
    }
  }

  previousBanner() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    } else {
      this.activeIndex = this.visibleBanners.length - 1; // Loop to last banner
    }
  }

  goToBanner(index: number) {
    this.activeIndex = index;
  }

  // Touch/swipe handling for mobile
  onSwipeStart(event: TouchEvent) {
    this.isSwiping = true;
    this.startX = event.touches[0].clientX;
  }

  onSwipeMove(event: TouchEvent) {
    if (!this.isSwiping) return;
    this.endX = event.touches[0].clientX;
  }

  onSwipeEnd() {
    if (!this.isSwiping) return;

    const diff = this.startX - this.endX;
    const threshold = 50; // Minimum swipe distance to trigger change

    if (diff > threshold) {
      this.nextBanner(); // Swipe left
    } else if (diff < -threshold) {
      this.previousBanner(); // Swipe right
    }

    this.isSwiping = false;
  }

  // Create placeholder banners for each type
  initializePlaceholders() {
    // Create placeholder banners for each banner type if needed
    const slidePlaceholder: Banner = {
      id: 'placeholder-slide',
      title: 'Banner Slide',
      fileId: '',
      position: 0,
      type: BannerType.SLIDE,
      deleted: false,
      imageUrl: 'assets/images/placeholders/slide-placeholder.jpg',
    };

    const leftPlaceholder: Banner = {
      id: 'placeholder-left',
      title: 'Banner Trái',
      fileId: '',
      position: 0,
      type: BannerType.LEFT_BANNER,
      deleted: false,
      imageUrl: 'assets/images/placeholders/left-placeholder.jpg',
    };

    const rightPlaceholder: Banner = {
      id: 'placeholder-right',
      title: 'Banner Phải',
      fileId: '',
      position: 0,
      type: BannerType.RIGHT_BANNER,
      deleted: false,
      imageUrl: 'assets/images/placeholders/right-placeholder.jpg',
    };

    // If there are no slide banners, use placeholder
    if (this.slideBanners.length === 0) {
      this.slideBanners = [slidePlaceholder];
    }

    // If left banner is null, use placeholder
    if (!this.leftBanner) {
      this.leftBanner = leftPlaceholder;
    }

    // If right banner is null, use placeholder
    if (!this.rightBanner) {
      this.rightBanner = rightPlaceholder;
    }
  }

  loadAllBanners() {
    this.loading = true;

    this.bannerService.getAllBanners().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const allBanners = response.data;

          // Process banners and resolve image URLs
          const bannersWithUrls = allBanners.map((banner) => {
            // Clone banner to avoid modifying the original data
            const processedBanner = { ...banner, imageUrl: undefined };

            // Resolve file URL if we have a fileId
            if (banner.fileId) {
              // Get image URL from FileUploadService
              this.uploadFileService.getFile(banner.fileId).subscribe(
                (res) => {
                  if (res && res.data) {
                    processedBanner.imageUrl = res.data.url;
                  }
                },
                (error) => {
                  console.error(
                    `Error fetching image for banner ${banner.id}:`,
                    error
                  );
                }
              );
            }
            return processedBanner;
          });

          // Group banners by type after resolving URLs
          this.slideBanners = bannersWithUrls
            .filter(
              (banner) => banner.type === BannerType.SLIDE && !banner.deleted
            )
            .sort((a, b) => a.position - b.position);

          this.leftBanner =
            bannersWithUrls.find(
              (banner) =>
                banner.type === BannerType.LEFT_BANNER && !banner.deleted
            ) || null;

          this.rightBanner =
            bannersWithUrls.find(
              (banner) =>
                banner.type === BannerType.RIGHT_BANNER && !banner.deleted
            ) || null;

          // For backward compatibility
          this.slides = this.slideBanners;

          // Initialize placeholders if needed sections are empty
          this.initializePlaceholders();

          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải dữ liệu banner:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải dữ liệu banner',
        });
        this.loading = false;
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.files[0];

    // Tạo URL xem trước
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  openNewDialog() {
    this.resetForm();
    this.dialogHeader = 'Thêm Banner mới';
    this.displayDialog = true;
  }

  openEditDialog(banner: Banner) {
    if (this.showPlaceholders && banner.id.startsWith('placeholder-')) {
      // For placeholders, create a new banner of the same type
      this.resetForm();
      this.bannerForm.patchValue({
        type: banner.type,
        position: banner.position,
      });
      this.dialogHeader = `Thêm ${this.getBannerTypeName(banner.type)}`;
      this.displayDialog = true;
      return;
    }

    // Default behavior for real banners
    this.editMode = true;
    this.currentBannerId = banner.id;

    this.bannerForm.patchValue({
      title: banner.title,
      type: banner.type,
      position: banner.position,
    });

    // Fix the type error by using nullish coalescing operator
    this.previewUrl = banner.imageUrl ?? null;
    this.dialogHeader = 'Chỉnh sửa Banner';
    this.displayDialog = true;
  }

  saveBanner() {
    if (this.bannerForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng điền đầy đủ thông tin!',
      });
      return;
    }

    // Always require an image for new banners
    if (!this.selectedFile && !this.editMode) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng chọn ảnh banner!',
      });
      return;
    }

    // For placeholders, always require a new image
    if (
      this.editMode &&
      this.currentBannerId &&
      this.currentBannerId.startsWith('placeholder-') &&
      !this.selectedFile
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng chọn ảnh banner cho banner mới!',
      });
      return;
    }

    // Step 1: Handle file upload if there's a new file
    if (this.selectedFile) {
      // Upload file first to get fileId
      this.uploadFileService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
          // FileUploadService.uploadFile returns response with fileId directly at the top level
          console.log('File upload response:', response);
          if (response && response.data) {
            // After successful upload, proceed with banner creation/update
            console.log(
              'File uploaded successfully, fileId:',
              response.data.id
            );
            if (
              this.editMode &&
              this.currentBannerId &&
              !this.currentBannerId.startsWith('placeholder-')
            ) {
              // Delete old banner first, then create new one
              this.deleteOldAndCreateNewBanner(response.data.id);
            } else {
              // Just create new banner with the new fileId
              this.createBanner(response.data.id);
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không nhận được fileId từ server',
            });
          }
        },
        error: (error) => {
          console.error('Lỗi khi tải ảnh lên:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải ảnh lên',
          });
        },
      });
    } else if (
      this.editMode &&
      this.currentBannerId &&
      !this.currentBannerId.startsWith('placeholder-')
    ) {
      // Edit case with no new file - use existing fileId
      const existingFileId = this.getCurrentBannerFileId();
      if (existingFileId) {
        this.deleteOldAndCreateNewBanner(existingFileId);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể lấy fileId hiện tại',
        });
      }
    }
  }

  handleUploadError = (error: any) => {
    console.error('Lỗi khi tải ảnh lên:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể tải ảnh lên',
    });
  };

  // Lấy fileId của banner đang được chỉnh sửa
  getCurrentBannerFileId(): string {
    if (!this.currentBannerId) return '';

    let currentBanner: Banner | null = null;

    if (this.leftBanner && this.leftBanner.id === this.currentBannerId) {
      currentBanner = this.leftBanner;
    } else if (
      this.rightBanner &&
      this.rightBanner.id === this.currentBannerId
    ) {
      currentBanner = this.rightBanner;
    } else {
      currentBanner =
        this.slides.find((s) => s.id === this.currentBannerId) || null;
    }

    return currentBanner ? currentBanner.fileId : '';
  }

  // Change the parameter type from UUID to string
  confirmDeleteBanner(id: string | UUID) {
    // Don't allow deleting placeholders
    if (typeof id === 'string' && id.startsWith('placeholder-')) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa banner này?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: () => {
        this.deleteBanner(id);
      },
    });
  }

  // Also change this parameter type from UUID to string
  deleteBanner(id: string | UUID) {
    // Skip placeholder banners
    if (typeof id === 'string' && id.startsWith('placeholder-')) {
      return;
    }

    this.bannerService.deleteBanner(id as UUID).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Xóa banner thành công',
        });

        // Find which type of banner was deleted
        const deletedBanner = this.findBannerById(id as string);
        if (deletedBanner) {
          // Replace with placeholder based on banner type
          if (deletedBanner.type === BannerType.SLIDE) {
            // For slide banners, replace the specific slide with a placeholder
            const index = this.slideBanners.findIndex((b) => b.id === id);
            if (index !== -1) {
              this.slideBanners[index] = {
                id: `placeholder-slide-${index}`,
                title: 'Banner Slide',
                fileId: '',
                position: index,
                type: BannerType.SLIDE,
                deleted: false,
                imageUrl: 'assets/images/placeholders/slide-placeholder.jpg',
              };
            }
          } else if (deletedBanner.type === BannerType.LEFT_BANNER) {
            // For left banner, replace with placeholder
            this.leftBanner = {
              id: 'placeholder-left',
              title: 'Banner Trái',
              fileId: '',
              position: 0,
              type: BannerType.LEFT_BANNER,
              deleted: false,
              imageUrl: 'assets/images/placeholders/left-placeholder.jpg',
            };
          } else if (deletedBanner.type === BannerType.RIGHT_BANNER) {
            // For right banner, replace with placeholder
            this.rightBanner = {
              id: 'placeholder-right',
              title: 'Banner Phải',
              fileId: '',
              position: 0,
              type: BannerType.RIGHT_BANNER,
              deleted: false,
              imageUrl: 'assets/images/placeholders/right-placeholder.jpg',
            };
          }
        }

        // No need to reload all banners since we've handled replacement locally
        // this.loadAllBanners(); - commented out
      },
      error: (error) => {
        console.error('Lỗi khi xóa banner:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa banner',
        });
      },
    });
  }

  // Helper method to find a banner by id across all banner collections
  private findBannerById(id: string | UUID): Banner | null {
    const idString = id.toString();

    // Check in slideBanners
    const slideMatch = this.slideBanners.find(
      (banner) => banner.id === idString
    );
    if (slideMatch) return slideMatch;

    // Check if it's the left banner
    if (this.leftBanner && this.leftBanner.id === idString) {
      return this.leftBanner;
    }

    // Check if it's the right banner
    if (this.rightBanner && this.rightBanner.id === idString) {
      return this.rightBanner;
    }

    return null;
  }

  // Add a method to create a placeholder based on banner type
  private createPlaceholder(type: BannerType, position: number = 0): Banner {
    const id = `placeholder-${type.toLowerCase()}-${position}`;
    const title = this.getBannerTypeName(type);
    let imagePath: string;

    switch (type) {
      case BannerType.SLIDE:
        imagePath = 'assets/images/placeholders/slide-placeholder.jpg';
        break;
      case BannerType.LEFT_BANNER:
        imagePath = 'assets/images/placeholders/left-placeholder.jpg';
        break;
      case BannerType.RIGHT_BANNER:
        imagePath = 'assets/images/placeholders/right-placeholder.jpg';
        break;
      default:
        imagePath = 'assets/images/placeholders/default-placeholder.jpg';
    }

    return {
      id,
      title,
      fileId: '',
      position,
      type,
      deleted: false,
      imageUrl: imagePath,
    };
  }

  resetForm() {
    this.bannerForm.reset({
      title: '',
      type: BannerType.SLIDE,
      position: 0,
    });
    this.previewUrl = null;
    this.selectedFile = null;
    this.editMode = false;
    this.currentBannerId = null;
  }

  // Phương thức để sắp xếp lại vị trí slides
  onRowReorder(event: any) {
    // We'll process banners sequentially to avoid race conditions
    const processReorder = async () => {
      // First, make a copy of all slides with their new positions
      const updatedSlides = this.slides.map((banner, index) => ({
        ...banner,
        position: index,
      }));

      // Process one by one - delete then create
      for (const banner of updatedSlides) {
        try {
          // Skip placeholders
          if (banner.id.startsWith('placeholder-')) continue;

          // First delete the banner
          await firstValueFrom(
            this.bannerService.deleteBanner(banner.id as UUID)
          );

          // Then create a new one with updated position
          const newBanner: Omit<Banner, 'id'> = {
            title: banner.title,
            fileId: banner.fileId,
            position: banner.position,
            type: banner.type,
            deleted: false,
          };

          await firstValueFrom(this.bannerService.createBanner(newBanner));
        } catch (error) {
          console.error(`Error reordering banner ${banner.id}:`, error);
        }
      }

      this.messageService.add({
        severity: 'info',
        summary: 'Thành công',
        detail: 'Đã thay đổi thứ tự banner',
      });

      // Reload banners to ensure UI is in sync with the server
      this.loadAllBanners();
    };

    // Start the reordering process
    processReorder();
  }

  // Get display name for banner type
  getBannerTypeName(type: BannerType): string {
    switch (type) {
      case BannerType.SLIDE:
        return 'Banner Slide';
      case BannerType.LEFT_BANNER:
        return 'Banner Trái';
      case BannerType.RIGHT_BANNER:
        return 'Banner Phải';
      default:
        return 'Banner';
    }
  }

  // Slide carousel control methods
  nextSlide() {
    if (this.activeSlideIndex < this.slideBanners.length - 1) {
      this.activeSlideIndex++;
    } else {
      this.activeSlideIndex = 0;
    }
  }

  previousSlide() {
    if (this.activeSlideIndex > 0) {
      this.activeSlideIndex--;
    } else {
      this.activeSlideIndex = this.slideBanners.length - 1;
    }
  }

  goToSlide(index: number) {
    this.activeSlideIndex = index;
  }

  // Create a new banner of specified type
  createNewBanner(type: BannerType) {
    this.resetForm();
    this.bannerForm.patchValue({
      type: type,
      position: type === BannerType.SLIDE ? this.slideBanners.length : 0,
    });

    this.dialogHeader = `Thêm ${this.getBannerTypeName(type)}`;
    this.displayDialog = true;
  }

  // Add the missing getBannerImageUrl method
  getBannerImageUrl(banner: Banner): string {
    // If we already have a resolved URL, return it
    if (banner.imageUrl) {
      return banner.imageUrl;
    }

    // If this is a placeholder, return the appropriate placeholder image
    if (banner.id.startsWith('placeholder-')) {
      switch (banner.type) {
        case BannerType.SLIDE:
          return 'assets/images/placeholders/slide-placeholder.jpg';
        case BannerType.LEFT_BANNER:
          return 'assets/images/placeholders/left-placeholder.jpg';
        case BannerType.RIGHT_BANNER:
          return 'assets/images/placeholders/right-placeholder.jpg';
        default:
          return 'assets/images/placeholders/default-placeholder.jpg';
      }
    }

    // If we have a fileId but no resolved URL yet, return a loading image
    if (banner.fileId) {
      return 'assets/images/placeholders/loading-placeholder.jpg';
    }

    // Fallback to default placeholder
    return 'assets/images/placeholders/default-placeholder.jpg';
  }

  // Delete old banner and create new one
  private deleteOldAndCreateNewBanner(fileId: string) {
    if (!this.currentBannerId) return;

    this.bannerService.deleteBanner(this.currentBannerId as UUID).subscribe({
      next: () => {
        // After successful deletion, create the new banner
        this.createBanner(fileId);
      },
      error: (error) => {
        console.error('Lỗi khi xóa banner cũ:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa banner cũ',
        });
      },
    });
  }

  // Create new banner with provided fileId
  private createBanner(fileId: string) {
    const formValue = this.bannerForm.value;

    const bannerData: Omit<Banner, 'id'> = {
      title: formValue.title,
      fileId: fileId, // Use the fileId from the uploaded file
      position: formValue.position,
      type: formValue.type,
      deleted: false,
    };

    this.bannerService.createBanner(bannerData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: this.editMode
            ? 'Cập nhật banner thành công'
            : 'Thêm banner mới thành công',
        });
        this.resetForm();
        this.displayDialog = false;
        this.loadAllBanners();
      },
      error: (error) => {
        console.error('Lỗi khi tạo banner:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tạo banner',
        });
      },
    });
  }
}
