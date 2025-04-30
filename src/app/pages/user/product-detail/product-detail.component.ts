import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductVariant } from '@app/core/models/Product.model';
import { FileUploadService } from '@app/core/services/FileUpload.service';
import { ProductService } from '@app/core/services/Product.service';
import { forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product?: Product; // Make the product property optional with '?'
  loading = true;
  selectedImage?: string;
  imageUrls: string[] = [];
  selectedSize?: string;
  selectedColor?: string;
  quantity: number = 1;
  availableSizes: string[] = [];
  availableColors: string[] = [];
  availableVariants: ProductVariant[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        switchMap((id) => {
          if (id === null) {
            throw new Error('Product ID is required');
          }
          return this.productService.getProductById(id);
        })
      )
      .subscribe({
        next: (response) => {
          this.product = response.data;
          this.loadProductImages();
          this.extractVariantOptions();
        },
        error: (err) => {
          console.error('Error fetching product:', err);
          this.loading = false;
        },
      });
  }

  loadProductImages(): void {
    if (this.product?.productImages && this.product.productImages.length > 0) {
      // Filter out images without a fileId before mapping
      const validImages = this.product.productImages.filter(
        (image) => !!image.fileId
      );

      if (validImages.length === 0) {
        this.loading = false;
        return;
      }

      const imageObservables = validImages.map((image) =>
        this.fileUploadService.getFile(image.fileId as string)
      );

      forkJoin(imageObservables).subscribe({
        next: (responses) => {
          this.imageUrls = responses.map((res) => res.data.url);
          this.selectedImage = this.imageUrls[0];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading images:', err);
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  extractVariantOptions(): void {
    if (this.product?.productVariants) {
      this.availableVariants = this.product.productVariants;
      this.availableSizes = [
        ...new Set(this.availableVariants.map((v) => v.size)),
      ].filter((size): size is string => size !== undefined);

      this.availableColors = [
        ...new Set(this.availableVariants.map((v) => v.color)),
      ].filter((color): color is string => color !== undefined);

      if (this.availableSizes.length > 0)
        this.selectedSize = this.availableSizes[0];
      if (this.availableColors.length > 0)
        this.selectedColor = this.availableColors[0];
    }
  }

  changeImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  addToCart(): void {
    // Implement add to cart functionality
    console.log('Add to cart:', {
      product: this.product,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity,
    });
  }

  getSelectedVariant(): ProductVariant | undefined {
    return this.availableVariants.find(
      (v) => v.size === this.selectedSize && v.color === this.selectedColor
    );
  }

  getAvailableQuantity(): number {
    const variant = this.getSelectedVariant();
    return variant?.quantity || 0;
  }
}
