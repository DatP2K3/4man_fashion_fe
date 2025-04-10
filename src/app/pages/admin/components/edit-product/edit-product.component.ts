import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { MessageService } from 'primeng/api';
import { UUID } from 'crypto';
import { CardModule } from 'primeng/card';

import { ProductService } from '@app/core/services/Product.service';
import { CategoryService } from '@app/core/services/Category.service';
import { FileUploadService } from '@app/core/services/FileUpload.service';
import { GeminiService } from '@app/core/services/Gemini.service';
import { Product } from '@app/core/models/Product';
import { ProductVariant } from '@app/core/models/ProductVariant';
import { ProductImage } from '@app/core/models/ProductImage';
import { Category } from '@app/core/models/Category';

interface Variant {
  name: string;
  options: string[];
}

interface VariantCombination {
  [key: string]: any;
  quantity: number;
  sku: string;
}

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    FileUploadModule,
    DropdownModule,
    CheckboxModule,
    DividerModule,
    EditorModule,
    DialogModule,
    TableModule,
    ChipModule,
    ToastModule,
    CardModule,
  ],
  providers: [MessageService],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  productForm!: FormGroup;
  formSubmitted = false;
  currentSection = 'basic';
  showVariantDialog = false;
  showMoreDescription = false;

  // Category data
  categories: Category[] = [];

  // Image handling
  mainImage: string | null = null;
  uploadedImages: ProductImage[] = [];
  currentImageView: string = 'main';

  // Add image preview object to store different image views
  imagePreviewUrls: { [key: string]: string } = {
    main: '',
    front: '',
    side: '',
    angles: '',
    using: '',
    variant: '',
    back: '',
    detail: '',
    size: '',
  };

  // Add mapping to track which image belongs to which view
  imageFileIdMap: { [key: string]: UUID } = {};

  // Variants handling
  variants: Variant[] = [];
  variantCombinations: VariantCombination[] = [];
  selectedVariantType: any = null;
  availableVariantTypes = [
    { name: 'Kích cỡ', value: 'size' },
    { name: 'màu sắc', value: 'color' },
  ];
  newSizeOption: string = '';
  newColorOption: string = '';

  // Weight units
  weightUnits = [{ name: 'Gram (g)', value: 'g' }];

  // AI Description
  aiDescriptionKeywords: string = '';
  isGeneratingDescription: boolean = false;

  // Form validation errors
  formErrors = {
    images: '',
  };

  // Thêm biến để lưu trữ các key mô tả và giá trị
  descriptionKeys: string[] = [];
  descriptionValues: Record<string, string> = {};

  // Gemini configuration
  isGeminiConfigured: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private fileUploadService: FileUploadService,
    private geminiService: GeminiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();

    // Check for edit mode (product ID in route)
    this.route.params.subscribe((params) => {
      if (params['id']) {
        // Load product data for editing
        // this.loadProductData(params['id']);
      }
    });

    // Đã xóa đoạn setTimeout để ngăn dialog tự động hiển thị
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: ['', Validators.required],
      introduce: ['', Validators.required],
      price: [null, Validators.required],
      sku: [''],
      weight: [null, Validators.required],
      weightUnit: ['g'],
      length: [null],
      width: [null],
      height: [null],
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (res: any) => {
        this.categories = res.data;
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh mục sản phẩm',
        });
      }
    );
  }

  // Section navigation
  scrollToSection(sectionId: string) {
    this.currentSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // File handling methods
  triggerFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.validateImageFile(file)) {
        this.uploadFile(file);
      }
    }
  }

  validateImageFile(file: File): boolean {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.formErrors.images = 'Chỉ chấp nhận định dạng JPG, JPEG hoặc PNG';
      return false;
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.formErrors.images = 'Kích thước tệp không được vượt quá 5MB';
      return false;
    }

    this.formErrors.images = '';
    return true;
  }

  uploadFile(file: File) {
    this.fileUploadService.uploadFile(file).subscribe(
      (response: any) => {
        if (response && response.data) {
          console.log('File upload response:', response);

          // Create a product image object
          const productImage = new ProductImage();
          productImage.file_id = response.data.id as UUID;
          productImage.avatar = this.currentImageView === 'main';

          // Store file ID for this view
          this.imageFileIdMap[this.currentImageView] = response.data.id;

          // Add to uploaded images array
          this.uploadedImages.push(productImage);

          // Display preview for the current image view
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // Store the preview URL in the imagePreviewUrls object for the current view
            this.imagePreviewUrls[this.currentImageView] = e.target.result;

            // Also update mainImage if this is the main view
            if (this.currentImageView === 'main') {
              this.mainImage = e.target.result;
            }
          };
          reader.readAsDataURL(file);

          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tải lên ảnh thành công',
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải lên ảnh',
        });
      }
    );
  }

  selectImageView(view: string) {
    this.currentImageView = view;
    this.triggerFileInput();
  }

  // Video handling
  onVideoSelect(event: any) {
    // Handle video selection
  }

  onVideoUpload(event: any) {
    const file = event.files[0];
    if (file) {
      this.fileUploadService.uploadFile(file).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tải lên video thành công',
          });
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải lên video',
          });
        }
      );
    }
  }

  // Category handling
  onCategoryChange(event: any) {
    if (event.value) {
      const selectedCategoryId = event.value;

      console.log('Selected Category ID:', selectedCategoryId);

      // Lấy category đã chọn
      const selectedCategory = this.categories.find(
        (cat) => cat.id === selectedCategoryId
      );

      console.log('Selected Category:', selectedCategory);

      if (
        selectedCategory &&
        selectedCategory.tag_descriptions &&
        selectedCategory.tag_descriptions.length > 0
      ) {
        console.log('Tag Descriptions:', selectedCategory.tag_descriptions);

        // Sử dụng tag_descriptions từ category đã chọn
        this.descriptionKeys = selectedCategory.tag_descriptions
          .filter((tag) => tag && tag.name) // Chỉ lấy tag có name
          .map((tag) => tag.name || '');

        console.log('Description Keys:', this.descriptionKeys);

        // Khởi tạo các giá trị mô tả rỗng cho mỗi key
        this.descriptionValues = {};
        this.descriptionKeys.forEach((key) => {
          this.descriptionValues[key] = '';
        });

        // Cuộn đến phần chi tiết sản phẩm để người dùng thấy ngay các trường mới
        setTimeout(() => {
          this.scrollToSection('details');
        }, 300);
      } else {
        // Reset nếu không có tag descriptions
        this.descriptionKeys = [];
        this.descriptionValues = {};
        console.log('No tag descriptions found for this category');
      }
    }
  }

  // Description handling
  toggleShowMore() {
    this.showMoreDescription = !this.showMoreDescription;
  }

  generateAIDescription() {
    if (!this.aiDescriptionKeywords) {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Vui lòng nhập từ khóa để tạo mô tả sản phẩm',
      });
      return;
    }

    this.isGeneratingDescription = true;

    // Clear any existing messages
    this.messageService.clear();

    this.messageService.add({
      severity: 'info',
      summary: 'Đang xử lý',
      detail: 'Đang tạo mô tả sản phẩm, vui lòng đợi...',
      life: 10000,
    });

    this.geminiService
      .generateProductDescription(this.aiDescriptionKeywords)
      .subscribe({
        next: (response: any) => {
          // Handle successful response from Gemini API
          if (
            response &&
            response.candidates &&
            response.candidates.length > 0
          ) {
            const generatedText = response.candidates[0].content.parts[0].text;

            // Set the generated text to the description form control
            this.productForm.get('introduce')?.setValue(generatedText);

            // Ensure the editor updates
            setTimeout(() => {
              if (this.productForm.get('introduce')) {
                this.productForm.get('introduce')?.updateValueAndValidity();
              }

              this.isGeneratingDescription = false;

              this.messageService.clear();
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã tạo mô tả sản phẩm từ AI',
                life: 5000,
              });
            }, 100);
          } else {
            this.handleDescriptionError(
              'Không thể tạo mô tả sản phẩm. Vui lòng thử lại.'
            );
          }
        },
        error: (error) => {
          console.error('Error generating AI description:', error);
          this.handleDescriptionError(
            'Lỗi khi tạo mô tả. Vui lòng kiểm tra kết nối và thử lại.'
          );
        },
      });
  }

  handleDescriptionError(message: string) {
    this.isGeneratingDescription = false;
    this.messageService.clear();
    this.messageService.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: message,
      life: 5000,
    });
  }

  // Variant handling
  showAddVariantDialog() {
    // Filter available variant types to exclude already selected ones
    this.availableVariantTypes = [
      { name: 'Kích cỡ', value: 'size' },
      { name: 'màu sắc', value: 'color' },
    ].filter((type) => !this.variants.some((v) => v.name === type.name));

    this.selectedVariantType = null;
    this.showVariantDialog = true;
  }

  closeVariantDialog() {
    this.showVariantDialog = false;
  }

  addVariant() {
    if (this.selectedVariantType) {
      const newVariant: Variant = {
        name: this.selectedVariantType.name,
        options: [],
      };
      this.variants.push(newVariant);
      this.closeVariantDialog();
    }
  }

  removeVariant(index: number) {
    this.variants.splice(index, 1);
    this.updateVariantCombinations();
  }

  addSizeOption() {
    if (this.newSizeOption && this.newSizeOption.trim() !== '') {
      const sizeVariant = this.variants.find((v) => v.name === 'Kích cỡ');
      if (sizeVariant && !sizeVariant.options.includes(this.newSizeOption)) {
        sizeVariant.options.push(this.newSizeOption);
        this.newSizeOption = '';
        this.updateVariantCombinations();
      }
    }
  }

  addColorOption() {
    if (this.newColorOption && this.newColorOption.trim() !== '') {
      const colorVariant = this.variants.find((v) => v.name === 'màu sắc');
      if (colorVariant && !colorVariant.options.includes(this.newColorOption)) {
        colorVariant.options.push(this.newColorOption);
        this.newColorOption = '';
        this.updateVariantCombinations();
      }
    }
  }

  removeOption(variantIndex: number, optionIndex: number) {
    this.variants[variantIndex].options.splice(optionIndex, 1);
    this.updateVariantCombinations();
  }

  updateVariantCombinations() {
    // Reset combinations
    this.variantCombinations = [];

    // If no variants or no variant options, return
    if (
      this.variants.length === 0 ||
      this.variants.every((v) => v.options.length === 0)
    ) {
      return;
    }

    // Generate all possible combinations
    const generateCombinations = (
      variants: Variant[],
      currentIndex: number,
      currentCombination: any
    ) => {
      if (currentIndex === variants.length) {
        // Add quantity and SKU fields to each combination (no price)
        const combination: VariantCombination = {
          ...currentCombination,
          quantity: 0,
          sku: '',
        };
        this.variantCombinations.push(combination);
        return;
      }

      const variant = variants[currentIndex];
      for (const option of variant.options) {
        const newCombination = {
          ...currentCombination,
          [variant.name.toLowerCase()]: option,
        };
        generateCombinations(variants, currentIndex + 1, newCombination);
      }
    };

    // Start generating combinations
    generateCombinations(this.variants, 0, {});
  }

  // Form submission
  onSubmit() {
    this.formSubmitted = true;

    console.log('Form validation state:', this.productForm.valid);
    console.log('Form values:', this.productForm.value);
    console.log('Form errors:', this.getFormValidationErrors());

    // Check if description keys and values are filled
    const isDescriptionFilled = Object.keys(this.descriptionValues).length > 0;

    if (
      this.productForm.invalid &&
      this.productForm.get('description')?.invalid &&
      isDescriptionFilled
    ) {
      // If only the description field is invalid but we have description values,
      // set a placeholder to pass validation
      this.productForm.get('description')?.setValue('placeholder');
    }

    if (this.productForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      });
      return;
    }

    // Check if at least one image is uploaded
    if (this.uploadedImages.length === 0) {
      this.formErrors.images = 'Vui lòng tải lên ít nhất một hình ảnh sản phẩm';
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng tải lên ít nhất một hình ảnh sản phẩm',
      });
      return;
    }

    // Create product object
    const product = new Product();
    product.name = this.productForm.get('name')?.value;
    product.categoryId = this.productForm.get('categoryId')?.value;
    product.description = { ...this.descriptionValues };

    // Set introduce field
    product.introduce = this.productForm.get('introduce')?.value;

    product.weight = this.productForm.get('weight')?.value;
    product.length = this.productForm.get('length')?.value;
    product.width = this.productForm.get('width')?.value;
    product.height = this.productForm.get('height')?.value;
    product.hidden = false;
    product.productImages = this.uploadedImages;

    // Set price at product level
    product.originPrice = this.productForm.get('price')?.value;

    // Handle variants
    if (this.variantCombinations.length > 0) {
      product.productVariants = this.variantCombinations.map((combination) => {
        const variant = new ProductVariant();

        // Set variant properties
        if (combination['kích cỡ']) {
          variant.size = combination['kích cỡ'];
        }

        if (combination['màu sắc']) {
          variant.color = combination['màu sắc'];
        }

        variant.quantity = combination.quantity;
        variant.sku = combination.sku;

        return variant;
      });
    } else {
      // If no variants, create a default variant with just quantity and SKU
      const variant = new ProductVariant();
      variant.quantity = 0;
      variant.sku = this.productForm.get('sku')?.value || '';
      product.productVariants = [variant];
    }

    console.log('Product object to save:', product);

    // Save product
    this.productService.createProduct(product).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Sản phẩm đã được tạo thành công',
        });
        this.router.navigate(['/admin/products']);
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tạo sản phẩm. Vui lòng thử lại',
        });
      }
    );
  }

  // Save as draft
  saveDraft() {
    this.formSubmitted = true;

    // Check if description keys and values are filled
    const isDescriptionFilled = Object.keys(this.descriptionValues).length > 0;

    if (
      this.productForm.invalid &&
      this.productForm.get('description')?.invalid &&
      isDescriptionFilled
    ) {
      // If only the description field is invalid but we have description values,
      // set a placeholder to pass validation
      this.productForm.get('description')?.setValue('placeholder');
    }

    if (this.productForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      });
      return;
    }

    // Create product object (similar to onSubmit)
    const product = new Product();
    product.name = this.productForm.get('name')?.value;
    product.categoryId = this.productForm.get('categoryId')?.value;
    product.description = { ...this.descriptionValues };

    // Set introduce field
    product.introduce = this.productForm.get('introduce')?.value;

    product.weight = this.productForm.get('weight')?.value;
    product.length = this.productForm.get('length')?.value;
    product.width = this.productForm.get('width')?.value;
    product.height = this.productForm.get('height')?.value;
    product.hidden = true; // Mark as draft
    product.productImages = this.uploadedImages;

    product.originPrice = this.productForm.get('price')?.value;

    // Handle variants (same as in onSubmit)
    if (this.variantCombinations.length > 0) {
      product.productVariants = this.variantCombinations.map((combination) => {
        const variant = new ProductVariant();
        if (combination['kích cỡ']) {
          variant.size = combination['kích cỡ'];
        }
        if (combination['màu sắc']) {
          variant.color = combination['màu sắc'];
        }
        variant.quantity = combination.quantity;
        variant.sku = combination.sku;
        return variant;
      });
    } else {
      const variant = new ProductVariant();
      variant.quantity = 0;
      variant.sku = this.productForm.get('sku')?.value || '';
      product.productVariants = [variant];
    }

    this.productService.createProduct(product).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã lưu nháp sản phẩm',
        });
        this.router.navigate(['/admin/products']);
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể lưu nháp. Vui lòng thử lại',
        });
      }
    );
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }

  // Thêm hàm để cập nhật giá trị mô tả khi người dùng nhập
  updateDescriptionValue(key: string, value: string) {
    this.descriptionValues[key] = value;
  }

  // Add this method to the component class
  getSelectedCategoryName(): string {
    const categoryId = this.productForm?.get('categoryId')?.value;
    if (!categoryId) return '';

    const selectedCategory = this.categories.find((c) => c.id === categoryId);
    return selectedCategory?.name || '';
  }

  // Helper method to debug form validation errors
  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
