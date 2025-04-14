import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductSearchRequest } from '../../../../core/models/product-search.model';
import { Product } from '../../../../core/models/Product.model';
import { ProductService } from '@app/core/services/Product.service';
import { FileUploadService } from '../../../../core/services/FileUpload.service';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    HttpClientModule,
  ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss',
})
export class ManageProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchKeyword: string = '';
  productImageCache: Map<string, string> = new Map<string, string>();

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  searchRequest: ProductSearchRequest = {
    page: 1,
    size: 10,
    sortField: 'name.sort',
    sortDirection: 'asc',
  };

  totalRecords: number = 0;

  constructor(
    private router: Router,
    private productService: ProductService,
    private fileUploadService: FileUploadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Set up debounce for search
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(1000), // 1 second delay
        distinctUntilChanged()
      )
      .subscribe((keyword) => {
        this.searchRequest.keyword = keyword;
        this.searchRequest.page = 1; // Reset to first page on new search
        this.loadProducts();
      });

    // Initial load of products
    this.loadProducts();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  searchProducts() {
    this.searchSubject.next(this.searchKeyword);
  }

  onPageChange(event: any) {
    // Clear existing data before making the API call
    this.filteredProducts = [];

    // Log the raw event
    console.log('Page change event raw:', event);

    // Calculate the page number from 'first' and 'rows'
    // 'first' is the index of the first record on the page (0-based)
    // 'rows' is the number of rows per page
    const pageNumber = Math.floor(event.first / event.rows) + 1;

    console.log(
      `Calculated page number: ${pageNumber} (first: ${event.first}, rows: ${event.rows})`
    );

    // Update search request with new pagination parameters
    this.searchRequest.page = pageNumber;
    this.searchRequest.size = event.rows;

    // Completely clear the image cache on page change
    this.productImageCache = new Map<string, string>();

    // Call API with updated parameters
    console.log(`Fetching page ${this.searchRequest.page} from server...`);
    this.loadProducts();
  }

  loadProducts() {
    // Ensure we have valid parameters
    this.searchRequest.page = Number(this.searchRequest.page) || 1;
    this.searchRequest.size = Number(this.searchRequest.size) || 10;

    console.log(`API Request: ${JSON.stringify(this.searchRequest)}`);

    // Instead of modifying the object type, use a separate params approach
    const requestParams = { ...this.searchRequest };

    this.productService.searchProducts(requestParams).subscribe({
      next: (response) => {
        console.log(`Response for page ${this.searchRequest.page}:`, response);

        if (response.success) {
          // Check if the data is different from what we already have
          const responseIds = response.data
            .map((item: any) => item.id)
            .join(',');
          console.log(`Received products with IDs: ${responseIds}`);

          // Map data to Product objects
          const newProducts = response.data.map((item: any) => {
            const product = new Product();
            Object.assign(product, item);
            return product;
          });

          // Update with completely new arrays to avoid reference issues
          this.products = [...newProducts];
          this.filteredProducts = [...newProducts];
          this.totalRecords = response.pageable.totalElements;

          console.log(
            `Updated UI with ${this.products.length} products for page ${this.searchRequest.page}`
          );

          // Force UI update
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
      complete: () => {
        console.log('Product loading completed');
      },
    });
  }

  navigateToAddProduct() {
    this.router.navigate(['/admin/manage-products/edit']);
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/manage-products/edit', product.id]);
  }

  toggleProductVisibility(product: Product) {
    if (product.id) {
      this.productService
        .toggleProductVisibility(product.id, !product.hidden)
        .subscribe({
          next: () => {
            product.hidden = !product.hidden;
            console.log(
              `Đã ${!product.hidden ? 'hiển thị' : 'ẩn'} sản phẩm: ${
                product.name
              }`
            );
          },
          error: (error) => {
            console.error('Error toggling product visibility:', error);
          },
        });
    }
  }

  getProductImageUrl(product: any): string {
    // If we already have the image URL cached, return it
    if (this.productImageCache.has(product.id)) {
      return this.productImageCache.get(product.id) as string;
    }

    // If product has avatarId, fetch the image
    if (product.avatarId) {
      // Return default initially
      const defaultImage = 'assets/images/products/default.jpg';
      this.productImageCache.set(product.id, defaultImage);

      // Fetch the actual image
      this.fileUploadService.getFile(product.avatarId).subscribe({
        next: (response) => {
          if (response && response.data) {
            // Update the cache with the actual image URL
            this.productImageCache.set(product.id, response.data.url);
          }
        },
        error: (error) => {
          console.error('Error loading product image:', error);
        },
      });

      return defaultImage;
    }
    // If product has productImages array, use the first one
    else if (product.productImages && product.productImages.length > 0) {
      const imageUrl = product.productImages[0].url;
      this.productImageCache.set(product.id, imageUrl);
      return imageUrl;
    }

    // Default case
    return 'assets/images/products/default.jpg';
  }
}
