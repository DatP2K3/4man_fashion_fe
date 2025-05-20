import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Banner, BannerType } from '@app/core/models/Banner.model';
import {
  ProductSearchRequest,
  ProductSearchResponse,
} from '@app/core/models/product-search.model';
import { BannerService } from '@app/core/services/Banner.service';
import { FileUploadService } from '@app/core/services/FileUpload.service';
import { ProductService } from '@app/core/services/Product.service';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UUID } from 'node:crypto';
import { Product } from '@app/core/models/Product.model';
import { DiscountType } from '@app/core/models/Discount.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  slides: Banner[] = [];
  leftBanners: Banner[] = [];
  rightBanners: Banner[] = [];
  products: Product[] = [];
  flashSaleProducts: Product[] = [];
  loading: boolean = true;
  flashSaleLoading: boolean = true;

  constructor(
    private bannerService: BannerService,
    private productService: ProductService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cuộn lên đầu trang khi component khởi tạo
    window.scrollTo(0, 0);

    this.loadBanners();
    this.loadProducts();
    this.loadFlashSaleProducts();
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

  loadBanners(): void {
    this.bannerService.getAllBanners().subscribe({
      next: (response) => {
        if (response.success) {
          // Filter banners by type
          this.slides = response.data.filter(
            (banner) => banner.type === BannerType.SLIDE
          );
          this.leftBanners = response.data.filter(
            (banner) => banner.type === BannerType.LEFT_BANNER
          );
          this.rightBanners = response.data.filter(
            (banner) => banner.type === BannerType.RIGHT_BANNER
          );

          // Process image URLs for all banners
          this.slides.forEach((banner) => {
            this.fetchFileUrl(banner.fileId, (url) => {
              banner.imageUrl = url;
            });
          });

          this.leftBanners.forEach((banner) => {
            this.fetchFileUrl(banner.fileId, (url) => {
              banner.imageUrl = url;
            });
          });

          this.rightBanners.forEach((banner) => {
            this.fetchFileUrl(banner.fileId, (url) => {
              banner.imageUrl = url;
            });
          });

          console.log('Banners loaded:', {
            slides: this.slides,
            leftBanners: this.leftBanners,
            rightBanners: this.rightBanners,
          });
        }
      },
      error: (error) => {
        console.error('Error fetching banners:', error);
      },
    });
  }

  loadProducts(): void {
    const searchRequest: ProductSearchRequest = {
      keyword: '',
      categoryId: '',
      hidden: false,
      sortBy: 'name.sort',
      pageIndex: 1,
      pageSize: 12,
      sortDirection: 'asc',
    };

    this.productService.searchProducts(searchRequest).subscribe({
      next: (response: ProductSearchResponse) => {
        this.products = response.data || [];

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
        console.log('Products loaded:', this.products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.loading = false;
      },
    });
  }

  loadFlashSaleProducts(): void {
    const searchRequest: ProductSearchRequest = {
      keyword: '',
      categoryId: '',
      hidden: false,
      sortBy: 'discountPercentage',
      pageIndex: 1,
      pageSize: 20, // Get more products to ensure we have enough flash sale ones
      sortDirection: 'desc',
    };

    this.productService.searchProducts(searchRequest).subscribe({
      next: (response: ProductSearchResponse) => {
        // Filter products by discount type FLASH_SALE
        this.flashSaleProducts = (response.data || [])
          .filter((product) => product.discountType === DiscountType.FLASH_SALE)
          .slice(0, 4); // Ensure we only take up to 4 items

        // Process product images
        this.flashSaleProducts.forEach((product) => {
          if (product.avatarId) {
            this.fetchFileUrl(product.avatarId, (url) => {
              product.imageUrl = url;
            });
          } else {
            product.imageUrl = 'assets/images/placeholder.png';
          }
        });

        this.flashSaleLoading = false;
        console.log('Flash Sale Products loaded:', this.flashSaleProducts);
      },
      error: (error) => {
        console.error('Error fetching flash sale products:', error);
        this.flashSaleLoading = false;
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
}
