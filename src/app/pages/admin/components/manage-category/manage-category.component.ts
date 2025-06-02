import { Component, OnInit } from '@angular/core';
import {
  Category,
  CreateOrUpdateCategoryRequest,
} from '@app/core/models/Category.model';
import { CategoryService } from '@app/core/services/Category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-manage-category',
  standalone: false,
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss'],
})
export class ManageCategoryComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  displayDialog = false;
  editMode = false;
  categoryForm: FormGroup;
  selectedCategory: Category | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.categoryForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      productType: ['', Validators.required],
      description: [''],
      tagDescriptions: [[]], // Chỉ còn name
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        console.log('Kết quả API:', res);
        // Nếu API trả về { data: Category[], ... }
        this.categories = (res as any).data || [];
        console.log('Categories loaded:', this.categories);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh mục',
        });
      },
    });
  }

  openNewDialog() {
    this.editMode = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.displayDialog = true;
  }

  openEditDialog(category: Category) {
    this.editMode = true;
    this.selectedCategory = category;
    this.categoryForm.patchValue(category);
    // Patch tagDescriptions nếu có, chỉ lấy name
    if (category.tagDescriptions) {
      const tags = category.tagDescriptions.map((tag) => ({
        name: tag.name || '',
      }));
      this.categoryForm.get('tagDescriptions')?.setValue(tags);
    }
    this.displayDialog = true;
  }

  // Thêm/xóa/sửa tagDescriptions trong dialog (chỉ còn name)
  addTagDescription() {
    const tags = this.categoryForm.get('tagDescriptions')?.value || [];
    tags.push({ name: '' });
    this.categoryForm.get('tagDescriptions')?.setValue(tags);
  }

  removeTagDescription(index: number) {
    const tags = this.categoryForm.get('tagDescriptions')?.value || [];
    tags.splice(index, 1);
    this.categoryForm.get('tagDescriptions')?.setValue(tags);
  }

  updateTagDescription(index: number, value: string) {
    const tags = this.categoryForm.get('tagDescriptions')?.value || [];
    tags[index].name = value;
    this.categoryForm.get('tagDescriptions')?.setValue(tags);
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;
    const formValue = this.categoryForm.value;
    // Chỉ lấy name cho từng tag
    const req: CreateOrUpdateCategoryRequest = {
      ...formValue,
      tagDescriptions: (formValue.tagDescriptions || []).map((tag: any) => ({
        name: tag.name,
      })),
    };
    if (this.editMode && req.id) {
      this.categoryService.updateCategory(req).subscribe({
        next: (res) => {
          this.messageService.add({
            key: 'main',
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật danh mục thành công',
            life: 2000, // Hiển thị 4 giây, có thể tăng lên nếu muốn lâu hơn
          });
          this.displayDialog = false;
          this.loadCategories();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Cập nhật thất bại',
          });
        },
      });
    } else {
      this.categoryService.createCategory(req).subscribe({
        next: (res) => {
          this.messageService.add({
            key: 'main',
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tạo danh mục thành công',
            life: 4000, // Hiển thị 4 giây, có thể tăng lên nếu muốn lâu hơn
          });
          this.displayDialog = false;
          this.loadCategories();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Tạo mới thất bại',
          });
        },
      });
    }
  }

  cancelDialog() {
    this.displayDialog = false;
  }

  toggleCategoryVisibility(category: Category) {
    if (!category.id) return;
    this.loading = true;
    this.categoryService.visibilityCategory(category.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: category.deleted
            ? 'Kích hoạt thành công'
            : 'Huỷ kích hoạt thành công',
          life: 3000,
        });
        this.loadCategories();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể thay đổi trạng thái danh mục',
        });
        this.loading = false;
      },
    });
  }
}
