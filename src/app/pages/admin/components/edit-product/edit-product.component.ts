import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  HostListener,
} from '@angular/core';
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
import {
  Product,
  ProductImage,
  ProductVariant,
} from '@app/core/models/Product.model';
import { Category } from '@app/core/models/Category.model';

interface Variant {
  name: string;
  options: string[];
  deleted?: boolean;
  deletedOptions?: string[];
}

interface VariantCombination {
  [key: string]: any;
  quantity: number;
  sku: string;
}

interface CompleteVariantInfo {
  id?: UUID;
  product_id?: UUID;
  productId?: UUID;
  size?: string;
  color?: string;
  quantity: number;
  sku: string;
  deleted: boolean;
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
  providers: [],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  // Form and UI state
  productForm!: FormGroup;
  formSubmitted = false;
  currentSection = 'basic';
  showVariantDialog = false;
  showMoreDescription = false;
  isEditMode = false;
  productId: string | null = null;
  isGeneratingDescription = false;

  // Data properties
  categories: Category[] = [];
  descriptionKeys: string[] = [];
  descriptionValues: Record<string, string> = {};
  mainImage: string | null = null;
  uploadedImages: ProductImage[] = [];
  deletedImages: ProductImage[] = [];
  variants: Variant[] = [];
  variantCombinations: VariantCombination[] = [];
  private variantInfoMap: Map<string, CompleteVariantInfo> = new Map();

  // Form inputs
  currentImageView = 'main';
  aiDescriptionKeywords = '';
  newSizeOption = '';
  newColorOption = '';
  selectedVariantType: any = null;

  // Options and configuration
  formErrors = { images: '' };
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
  imageFileIdMap: { [key: string]: UUID } = {};
  filledViewTypes: Set<string> = new Set();
  availableViewTypes = [
    'front',
    'side',
    'angles',
    'using',
    'variant',
    'back',
    'detail',
    'size',
  ];
  availableVariantTypes = [
    { name: 'Kích cỡ', value: 'size' },
    { name: 'màu sắc', value: 'color' },
  ];
  weightUnits = [{ name: 'Gram (g)', value: 'g' }];

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
    this.loadCategories().then(() => {
      this.route.paramMap.subscribe((params) => {
        const productId = params.get('id');
        if (productId) {
          this.isEditMode = true;
          this.productId = productId;
          this.loadProductData(productId);
        } else {
          this.isEditMode = false;
          this.productId = null;
        }
      });
    });
  }

  ngOnDestroy(): void {
    // Clean up resources if needed
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const sections = ['basic', 'details', 'sales', 'shipping'];
    let currentActiveSection = '';

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentActiveSection = section;
          break;
        }
      }
    }

    if (currentActiveSection) {
      this.currentSection = currentActiveSection;
    }
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

  loadCategories(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.categoryService.getCategories().subscribe({
        next: (res: any) => {
          this.categories = res.data;
          resolve();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải danh mục sản phẩm',
          });
          resolve(); // Still resolve to continue the flow
        },
      });
    });
  }

  scrollToSection(sectionId: string) {
    this.currentSection = sectionId;
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  }

  // Image handling methods
  triggerFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.validateImageFile(file)) {
      this.uploadFile(file);
    }
  }

  validateImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.formErrors.images = 'Chỉ chấp nhận định dạng JPG, JPEG hoặc PNG';
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.formErrors.images = 'Kích thước tệp không được vượt quá 5MB';
      return false;
    }

    this.formErrors.images = '';
    return true;
  }

  selectImageView(view: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.currentImageView = view;
    this.triggerFileInput();
  }

  // Add drag and drop functionality
  onImageDrop(event: DragEvent, view: string) {
    event.preventDefault();

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];

      // Set the current image view before uploading
      this.currentImageView = view;

      if (this.validateImageFile(file)) {
        this.uploadFile(file);
      }
    }
  }

  uploadFile(file: File) {
    this.fileUploadService.uploadFile(file).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          // Create a product image object
          const productImage: ProductImage = {
            file_id: response.data.id as UUID,
            fileId: response.data.id as UUID,
            avatar: this.currentImageView === 'main',
            deleted: false,
          };

          // Store file ID for this view
          this.imageFileIdMap[this.currentImageView] = response.data.id;
          this.uploadedImages.push(productImage);

          // Display preview
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviewUrls[this.currentImageView] = e.target.result;
            this.filledViewTypes.add(this.currentImageView);
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
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải lên ảnh',
        });
      },
    });
  }

  onVideoUpload(event: any) {
    const file = event.files[0];
    if (file) {
      this.fileUploadService.uploadFile(file).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tải lên video thành công',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải lên video',
          });
        },
      });
    }
  }

  onCategoryChange(event: any) {
    if (event.value) {
      const selectedCategoryId = event.value;
      const selectedCategory = this.categories.find(
        (cat) => cat.id === selectedCategoryId
      );

      // Fix: Use optional chaining to safely access nested properties
      if (
        selectedCategory?.tagDescriptions &&
        selectedCategory.tagDescriptions.length > 0
      ) {
        this.descriptionKeys = selectedCategory.tagDescriptions
          .filter((tag) => tag && tag.name)
          .map((tag) => tag.name || '');

        // Initialize description values
        this.descriptionValues = {};
        this.descriptionKeys.forEach((key) => {
          this.descriptionValues[key] = '';
        });

        // Scroll to details section
        setTimeout(() => {
          this.scrollToSection('details');
        }, 300);
      } else {
        this.descriptionKeys = [];
        this.descriptionValues = {};
      }
    }
  }

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
          if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const generatedText = response.candidates[0].content.parts[0].text;
            this.productForm.get('introduce')?.setValue(generatedText);

            setTimeout(() => {
              this.productForm.get('introduce')?.updateValueAndValidity();
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
        error: () => {
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

  // Variant handling methods
  showAddVariantDialog() {
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

  removeVariant(activeIndex: number) {
    const activeVariants = this.getActiveVariants();
    const variantToRemove = activeVariants[activeIndex];
    const fullIndex = this.variants.findIndex(
      (v) => v.name === variantToRemove.name && !v.deleted
    );

    if (fullIndex !== -1) {
      // Mark variant combinations as deleted
      const variantName = this.variants[fullIndex].name;
      this.variantCombinations.forEach((combo) => {
        if (
          (variantName === 'Kích cỡ' && combo['kích cỡ']) ||
          (variantName === 'màu sắc' && combo['màu sắc'])
        ) {
          const key = this.createVariantKey(combo);
          this.variantInfoMap.set(key, {
            size: combo['kích cỡ'],
            color: combo['màu sắc'],
            quantity: combo.quantity,
            sku: combo.sku,
            deleted: true,
          });
        }
      });

      // Mark variant as deleted
      this.variants[fullIndex].deleted = true;
      this.updateVariantCombinations();
    }
  }

  addSizeOption() {
    if (this.newSizeOption?.trim()) {
      const sizeVariant = this.variants.find((v) => v.name === 'Kích cỡ');
      if (sizeVariant && !sizeVariant.options.includes(this.newSizeOption)) {
        sizeVariant.options.push(this.newSizeOption);
        this.newSizeOption = '';
        this.updateVariantCombinations();
      }
    }
  }

  addColorOption() {
    if (this.newColorOption?.trim()) {
      const colorVariant = this.variants.find((v) => v.name === 'màu sắc');
      if (colorVariant && !colorVariant.options.includes(this.newColorOption)) {
        colorVariant.options.push(this.newColorOption);
        this.newColorOption = '';
        this.updateVariantCombinations();
      }
    }
  }

  removeOption(variantIndex: number, optionIndex: number) {
    const optionToRemove = this.variants[variantIndex].options[optionIndex];
    const variantName = this.variants[variantIndex].name;

    // Store deleted variant info
    this.variantCombinations.forEach((combo) => {
      if (
        (variantName === 'Kích cỡ' && combo['kích cỡ'] === optionToRemove) ||
        (variantName === 'màu sắc' && combo['màu sắc'] === optionToRemove)
      ) {
        const key = this.createVariantKey(combo);
        this.variantInfoMap.set(key, {
          size: combo['kích cỡ'],
          color: combo['màu sắc'],
          quantity: combo.quantity,
          sku: combo.sku,
          deleted: true,
          ...this.getExistingVariantInfo(key),
        });
      }
    });

    // Track deleted options
    if (!this.variants[variantIndex].deletedOptions) {
      this.variants[variantIndex].deletedOptions = [];
    }
    this.variants[variantIndex].deletedOptions.push(optionToRemove);

    // Remove from active options
    this.variants[variantIndex].options.splice(optionIndex, 1);
    this.updateVariantCombinations();
  }

  updateVariantCombinations() {
    // Save existing combinations data
    const existingCombinations = [...this.variantCombinations];
    this.variantCombinations = [];

    // Get active variants
    const activeVariants = this.getActiveVariants();

    // If no active variants, return
    if (
      !activeVariants.length ||
      activeVariants.every((v) => !v.options.length)
    ) {
      return;
    }

    // Generate combinations recursively
    const generateCombinations = (
      variants: Variant[],
      currentIndex: number,
      currentCombination: any
    ) => {
      if (currentIndex === variants.length) {
        // Create new combination
        const combination: VariantCombination = {
          ...currentCombination,
          quantity: 0,
          sku: '',
        };

        // Restore existing data if found
        const existingCombo = this.findMatchingCombination(
          combination,
          existingCombinations
        );
        if (existingCombo) {
          combination.quantity = existingCombo.quantity;
          combination.sku = existingCombo.sku;
        }

        this.variantCombinations.push(combination);
        return;
      }

      // Generate combinations for each option of current variant
      const variant = variants[currentIndex];
      for (const option of variant.options) {
        const newCombination = {
          ...currentCombination,
          [variant.name.toLowerCase()]: option,
        };
        generateCombinations(variants, currentIndex + 1, newCombination);
      }
    };

    // Start recursive generation
    generateCombinations(activeVariants, 0, {});
  }

  findMatchingCombination(
    newCombination: VariantCombination,
    existingCombinations: VariantCombination[]
  ): VariantCombination | undefined {
    return existingCombinations.find((existing) => {
      for (const variant of this.variants) {
        const variantKey = variant.name.toLowerCase();
        if (
          !existing[variantKey] ||
          existing[variantKey] !== newCombination[variantKey]
        ) {
          return false;
        }
      }
      return true;
    });
  }

  onSubmit() {
    this.formSubmitted = true;

    // Handle description validation
    const isDescriptionFilled = Object.keys(this.descriptionValues).length > 0;
    if (this.productForm.get('description')?.invalid && isDescriptionFilled) {
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

    // Check if main image is present
    if (!this.imagePreviewUrls['main']) {
      this.formErrors.images = 'Vui lòng tải lên ảnh chính của sản phẩm';
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng tải lên ảnh chính của sản phẩm',
      });
      return;
    }

    // Create product object
    const product = new Product();

    if (this.isEditMode && this.productId) {
      product.id = this.productId as unknown as UUID;
    }

    // Set basic product details
    product.name = this.productForm.get('name')?.value;
    product.categoryId = this.productForm.get('categoryId')?.value;
    product.description = { ...this.descriptionValues };
    product.introduce = this.productForm.get('introduce')?.value;
    product.weight = this.productForm.get('weight')?.value;
    product.length = this.productForm.get('length')?.value;
    product.width = this.productForm.get('width')?.value;
    product.height = this.productForm.get('height')?.value;
    product.hidden = false;
    product.originPrice = this.productForm.get('price')?.value;

    // Set product images - only include active images
    if (this.uploadedImages.length > 0) {
      product.productImages = this.uploadedImages
        .filter((img) => !img.deleted)
        .map((img) => {
          const image: ProductImage = {
            id: img.id,
            fileId: img.file_id || img.fileId,
            file_id: img.file_id,
            avatar: img.avatar,
            deleted: false,
          };

          if (this.isEditMode && this.productId) {
            image.product_id = this.productId as unknown as UUID;
            image.productId = this.productId as unknown as UUID;
          }

          return image;
        });
    }

    // Set product variants
    if (this.variantCombinations.length > 0) {
      product.productVariants = this.variantCombinations.map((combination) => {
        // Replace class instantiation with interface object
        const variant: ProductVariant = {
          quantity: combination.quantity,
          sku: combination.sku,
          deleted: false,
        };

        if (combination['kích cỡ']) {
          variant.size = combination['kích cỡ'];
        }

        if (combination['màu sắc']) {
          variant.color = combination['màu sắc'];
        }

        // Find existing ID if available
        const key = this.createVariantKey(combination);
        const existingInfo = this.variantInfoMap.get(key);
        if (existingInfo?.id) {
          variant.id = existingInfo.id;
        }

        if (this.isEditMode && this.productId) {
          variant.productId = this.productId as unknown as UUID;
        }

        return variant;
      });
    } else {
      // Default variant if none exist
      // Replace class instantiation with interface object
      const variant: ProductVariant = {
        quantity: 0,
        sku: this.productForm.get('sku')?.value || '',
        deleted: false,
      };

      if (this.isEditMode) {
        const defaultVariant = this.variantInfoMap.get(':');
        if (defaultVariant?.id) {
          variant.id = defaultVariant.id;
        }

        if (this.productId) {
          variant.productId = this.productId as unknown as UUID;
        }
      }

      product.productVariants = [variant];
    }

    // Save product
    const saveMethod = this.isEditMode
      ? this.productService.updateProduct(product)
      : this.productService.createProduct(product);

    saveMethod.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: this.isEditMode
            ? 'Sản phẩm đã được cập nhật thành công'
            : 'Sản phẩm đã được tạo thành công',
        });
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: this.isEditMode
            ? 'Không thể cập nhật sản phẩm. Vui lòng thử lại'
            : 'Không thể tạo sản phẩm. Vui lòng thử lại',
        });
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }

  updateDescriptionValue(key: string, value: string) {
    this.descriptionValues[key] = value;
  }

  getSelectedCategoryName(): string {
    const categoryId = this.productForm?.get('categoryId')?.value;
    if (!categoryId) return '';
    const selectedCategory = this.categories.find((c) => c.id === categoryId);
    return selectedCategory?.name || '';
  }

  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  loadProductData(productId: string) {
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        if (response?.success) {
          const product = response.data;

          // Set category ID first
          if (product.categoryId || product.category_id) {
            const categoryId = product.categoryId || product.category_id;
            this.productForm.get('categoryId')?.setValue(categoryId);

            // Get description fields from category
            const selectedCategory = this.categories.find(
              (cat) => cat.id === categoryId
            );
            // Fix: Use optional chaining to safely access nested properties
            if (
              selectedCategory?.tagDescriptions &&
              selectedCategory.tagDescriptions.length > 0
            ) {
              this.descriptionKeys = selectedCategory.tagDescriptions
                .filter((tag) => tag && tag.name)
                .map((tag) => tag.name || '');
            }
          }

          // Fill form data
          this.productForm.patchValue({
            name: product.name,
            introduce: product.introduce,
            price: product.originPrice || product.origin_price,
            sku:
              product.productVariants?.[0]?.sku ||
              product.product_variants?.[0]?.sku ||
              '',
            weight: product.weight,
            weightUnit: product.weightUnit || 'g',
            length: product.length,
            width: product.width,
            height: product.height,
          });

          // Set description values
          if (product.description) {
            this.descriptionValues = { ...product.description };

            // If no keys from category, use product keys
            if (!this.descriptionKeys?.length) {
              this.descriptionKeys = Object.keys(product.description);
            }
          }

          // Clear existing data
          this.variants = [];
          this.variantCombinations = [];
          this.uploadedImages = [];
          this.clearImagePreviews();

          // Load product data
          if (product.productVariants || product.product_variants) {
            this.loadProductVariants({
              ...product,
              productVariants:
                product.productVariants || product.product_variants,
            });
          }

          if (product.productImages || product.product_images) {
            this.loadProductImages({
              ...product,
              productImages: product.productImages || product.product_images,
            });
          }
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin sản phẩm',
        });
      },
    });
  }

  clearImagePreviews() {
    for (const viewType of ['main', ...this.availableViewTypes]) {
      this.imagePreviewUrls[viewType] = '';
    }
    this.filledViewTypes.clear();
  }

  loadProductVariants(product: any) {
    if (!product.productVariants?.length) return;

    // Filter out deleted variants
    const activeProductVariants = product.productVariants.filter(
      (v: any) => !v.deleted
    );

    // Check for size variants
    const hasSizes = activeProductVariants.some((v: any) => v.size?.trim());
    if (hasSizes) {
      const sizeVariant: Variant = { name: 'Kích cỡ', options: [] };
      activeProductVariants.forEach((v: any) => {
        if (v.size?.trim() && !sizeVariant.options.includes(v.size)) {
          sizeVariant.options.push(v.size);
        }
      });

      if (sizeVariant.options.length > 0) {
        this.variants.push(sizeVariant);
      }
    }

    // Check for color variants
    const hasColors = activeProductVariants.some((v: any) => v.color?.trim());
    if (hasColors) {
      const colorVariant: Variant = { name: 'màu sắc', options: [] };
      activeProductVariants.forEach((v: any) => {
        if (v.color?.trim() && !colorVariant.options.includes(v.color)) {
          colorVariant.options.push(v.color);
        }
      });

      if (colorVariant.options.length > 0) {
        this.variants.push(colorVariant);
      }
    }

    // Generate combinations
    if (this.variants.length > 0) {
      this.updateVariantCombinations();

      // Fill quantities and SKUs
      if (this.variantCombinations.length > 0) {
        product.productVariants.forEach((v: any) => {
          const combo = this.variantCombinations.find(
            (c) =>
              (!v.size || c['kích cỡ'] === v.size) &&
              (!v.color || c['màu sắc'] === v.color)
          );

          if (combo) {
            combo.quantity = v.quantity || 0;
            combo.sku = v.sku || '';
          }
        });
      }
    }

    // Initialize variant tracking
    this.variants.forEach((variant) => {
      variant.deletedOptions = [];
    });

    // Store all variant info (including deleted)
    if (product.productVariants.length > 0) {
      this.variantInfoMap.clear();

      product.productVariants.forEach((v: any) => {
        if (v.size || v.color) {
          const key = `${v.size || ''}:${v.color || ''}`;
          this.variantInfoMap.set(key, {
            id: v.id,
            product_id: v.product_id,
            size: v.size,
            color: v.color,
            quantity: v.quantity || 0,
            sku: v.sku || '',
            deleted: v.deleted || false,
          });
        }
      });
    }
  }

  loadProductImages(product: any) {
    if (!product.productImages?.length) return;

    // Find avatar image
    const avatarImage = product.productImages.find(
      (image: any) => image.avatar
    );
    const nonAvatarImages = product.productImages.filter(
      (image: any) => !image.avatar
    );

    // Process in order: avatar first, then others
    const allImagesInOrder = avatarImage
      ? [avatarImage, ...nonAvatarImages]
      : nonAvatarImages;
    let viewTypeIndex = 0;

    // Process each image
    allImagesInOrder.forEach((image: any) => {
      const productImage: ProductImage = {
        id: image.id,
        file_id: image.fileId || image.file_id,
        fileId: image.fileId || image.file_id,
        avatar: image.avatar,
        product_id: image.product_id || (this.productId as unknown as UUID),
        deleted: false,
      };

      this.uploadedImages.push(productImage);

      // Load image preview
      this.fileUploadService.getFile(image.fileId).subscribe({
        next: (response) => {
          if (response?.data) {
            let viewType = '';

            // Place avatar in main position
            if (image.avatar) {
              viewType = 'main';
              this.mainImage = response.data.url;
            } else {
              // Assign next available view type
              if (viewTypeIndex < this.availableViewTypes.length) {
                viewType = this.availableViewTypes[viewTypeIndex++];
              } else {
                viewType = 'variant'; // Fallback
              }
            }

            // Store preview and mapping
            this.imagePreviewUrls[viewType] = response.data.url;
            this.imageFileIdMap[viewType] = image.fileId;
            this.filledViewTypes.add(viewType);
          }
        },
        error: () => {
          /* Handle silently */
        },
      });
    });

    // Track deleted images
    this.deletedImages = product.productImages
      .filter((img: any) => img.deleted === true)
      .map((img: any) => {
        const deletedImage: ProductImage = {
          id: img.id,
          file_id: img.fileId || img.file_id,
          fileId: img.fileId || img.file_id,
          avatar: img.avatar || false,
          product_id: img.product_id || (this.productId as unknown as UUID),
          deleted: true,
        };
        return deletedImage;
      });
  }

  getActiveVariants(): Variant[] {
    return this.variants.filter((v) => !v.deleted);
  }

  private createVariantKey(combination: VariantCombination): string {
    const size = combination['kích cỡ'] || '';
    const color = combination['màu sắc'] || '';
    return `${size}:${color}`;
  }

  removeImage(imageView: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const fileId = this.imageFileIdMap[imageView];
    if (fileId) {
      const imageIndex = this.uploadedImages.findIndex(
        (img) => img.file_id === fileId || img.fileId === fileId
      );

      if (imageIndex !== -1) {
        const imageToRemove = this.uploadedImages[imageIndex];

        // Preserve ID for backend
        if (imageToRemove.id) {
          const deletedImg: ProductImage = {
            id: imageToRemove.id,
            file_id: imageToRemove.file_id,
            fileId: imageToRemove.fileId,
            avatar: imageToRemove.avatar,
            deleted: true,
          };

          if (this.productId) {
            deletedImg.product_id = this.productId as unknown as UUID;
            deletedImg.productId = this.productId as unknown as UUID;
          }
          this.deletedImages.push(deletedImg);
        }

        // Remove from active images
        this.uploadedImages.splice(imageIndex, 1);

        // Clear previews
        this.imagePreviewUrls[imageView] = '';
        delete this.imageFileIdMap[imageView];
        this.filledViewTypes.delete(imageView);

        if (imageView === 'main') {
          this.mainImage = null;
        }
      }
    }
  }

  private getExistingVariantInfo(key: string): Partial<CompleteVariantInfo> {
    const existing = this.variantInfoMap.get(key);
    if (existing?.id) {
      return {
        id: existing.id,
        product_id: existing.product_id,
      };
    }
    return {};
  }

  getActiveVariantCombinations(): VariantCombination[] {
    if (!this.variantCombinations?.length) {
      return [];
    }

    return this.variantCombinations.filter((combination) => {
      const key = this.createVariantKey(combination);
      const variantInfo = this.variantInfoMap.get(key);
      return !variantInfo || !variantInfo.deleted;
    });
  }
}
