import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@app/core/models/Product.model';
import { ProductSearchRequest } from '@app/core/models/product-search.model';
import { CategoryService } from '@app/core/services/Category.service';
import { FileUploadService } from '@app/core/services/FileUpload.service';
import { ProductService } from '@app/core/services/Product.service';
import { Category } from '@app/core/models/Category.model';

@Component({
  selector: 'app-category-products',
  standalone: false,
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.scss'],
})
export class CategoryProductsComponent implements OnInit {
  // Make Math available to template
  Math = Math;

  products: Product[] = [];
  loading: boolean = true;
  categoryId: string | null = null;
  productType: string | null = null; // 'ao' or 'quan'
  category: Category | null = null;
  pageIndex: number = 1;
  pageSize: number = 12;
  totalElements: number = 0;
  totalPages: number = 0;
  categoryName: string = 'Sản phẩm'; // Default title

  // Add category lists to display on the main menu pages
  aoCategories: Category[] = [];
  quanCategories: Category[] = [];

  // Fixed sort options with corrected price sorting
  sortOptions = [
    { label: 'A-Z', value: 'name.sort,asc' },
    { label: 'Z-A', value: 'name.sort,desc' },
    { label: 'Giá thấp đến cao', value: 'discountPrice,asc' },
    { label: 'Giá cao đến thấp', value: 'discountPrice,desc' },
    { label: 'Giảm giá nhiều nhất', value: 'discountPercentage,desc' },
  ];
  selectedSort: string = this.sortOptions[0].value;

  // New property to hold search keyword
  searchKeyword: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    // Scroll to top when component initializes
    window.scrollTo(0, 0);

    // Ưu tiên lấy keyword từ query param
    this.route.queryParamMap.subscribe((params) => {
      const keyword = params.get('keyword');
      if (keyword) {
        this.searchKeyword = keyword;
        this.categoryId = null;
        this.categoryName = `Kết quả tìm kiếm cho "${keyword}"`;
        this.resetPagination();
        this.loadProducts();
      } else {
        // Nếu không có keyword thì xử lý theo category như cũ
        this.route.paramMap.subscribe((params) => {
          this.productType =
            this.route.snapshot.data['type'] || params.get('type'); // Get from route data or params
          this.categoryId = params.get('id');
          this.resetPagination();

          // Only load products if we have a category ID (submenu)
          if (this.categoryId) {
            this.loadCategoryDetails();
          } else {
            // For main menu items (AO/QUAN), show empty state with instructions
            this.loading = false;
            if (this.productType === 'ao') {
              this.categoryName = 'Danh mục Áo';
              this.loadCategoriesForType('Áo');
            } else if (this.productType === 'quan') {
              this.categoryName = 'Danh mục Quần';
              this.loadCategoriesForType('Quần');
            } else {
              this.categoryName = 'Danh mục sản phẩm';
            }
          }
        });
      }
    });
  }

  resetPagination(): void {
    this.pageIndex = 1;
    this.pageSize = 12;
    this.totalElements = 0;
    this.totalPages = 0;
  }

  loadCategoryDetails(): void {
    if (this.categoryId) {
      // Load specific category details by ID
      this.loading = true;
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (response) => {
          if (response && response.data) {
            this.category = response.data;
            console.log('Category details:', this.category);
            this.categoryName = this.category.name || 'Sản phẩm';
          }
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error fetching category details:', err);
          // If we can't get the category, still try to load products
          this.loadProducts();
        },
      });
    } else if (this.productType) {
      // Just use product type as a title (Áo or Quần)
      if (this.productType === 'ao') {
        this.categoryName = 'Áo';
      } else if (this.productType === 'quan') {
        this.categoryName = 'Quần';
      }
      this.loadProducts();
    } else {
      this.categoryName = 'Tất cả sản phẩm';
      this.loadProducts();
    }
  }

  // Add method to load categories for a specific type (Áo or Quần)
  loadCategoriesForType(productType: string): void {
    this.loading = true;
    this.categoryService.getCategoriesByProductType(productType).subscribe({
      next: (response) => {
        if (response && response.success) {
          if (productType === 'Áo') {
            this.aoCategories = response.data || [];
          } else if (productType === 'Quần') {
            this.quanCategories = response.data || [];
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(`Error fetching ${productType} categories:`, err);
        this.loading = false;
      },
    });
  }

  loadProducts(): void {
    this.loading = true;

    // Parse sort options
    const [sortBy, sortDirection] = this.selectedSort.split(',');

    const searchRequest: ProductSearchRequest = {
      keyword: this.searchKeyword || '',
      categoryId: this.searchKeyword ? '' : this.categoryId || '',
      hidden: false,
      sortBy: sortBy || 'name.sort',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sortDirection: sortDirection || 'asc',
    };
    console.log('Search request:', searchRequest);

    this.productService.searchProducts(searchRequest).subscribe({
      next: (response) => {
        this.products = response.data || [];

        console.log('Products loaded:', this.products);
        this.totalElements = response.pageable?.totalElements || 0;
        this.totalPages = response.pageable?.totalPages || 0;

        console.log('Pagination info:', {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          totalElements: this.totalElements,
          totalPages: this.totalPages,
        });

        // Process product images
        this.products.forEach((product) => {
          if (product.avatarId) {
            this.fetchFileUrl(product.avatarId, (url) => {
              product.imageUrl = url;
            });
          } else {
            product.imageUrl = 'assets/images/placeholder.png';
          }
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.loading = false;
      },
    });
  }

  // Helper method to fetch a file URL
  private fetchFileUrl(fileId: string, callback: (url: string) => void): void {
    if (!fileId) {
      callback('assets/images/placeholder.png');
      return;
    }

    this.fileUploadService.getFile(fileId).subscribe({
      next: (response) => {
        if (response && response.data && response.data.url) {
          callback(response.data.url);
        } else {
          callback('assets/images/placeholder.png');
        }
      },
      error: (error) => {
        console.error(`Error fetching file with id ${fileId}:`, error);
        callback('assets/images/placeholder.png');
      },
    });
  }

  navigateToProductDetail(productId: string | undefined): void {
    if (productId) {
      this.router.navigate(['/product-detail', productId]);
    } else {
      console.error('Product ID is undefined');
    }
  }

  // Fixed pagination method to correctly handle PrimeNG's zero-based pagination
  onPageChange(event: any): void {
    console.log('Page changed:', event);
    this.pageIndex = event.page + 1; // PrimeNG paginator is 0-based
    this.pageSize = event.rows; // Update pageSize if user changes it
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  onSortChange(event: any): void {
    this.selectedSort = event.value;
    this.resetPagination();
    this.loadProducts();
  }
}
