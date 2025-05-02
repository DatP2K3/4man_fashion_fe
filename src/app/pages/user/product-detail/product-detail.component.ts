import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Product, ProductVariant } from '@app/core/models/Product.model';
import { ProductSearchRequest } from '@app/core/models/product-search.model';
import { FileUploadService } from '@app/core/services/FileUpload.service';
import { ProductService } from '@app/core/services/Product.service';
import { CartService } from '@app/core/services/Cart.service';
import { AppStateService } from '@app/shared/state/AppState.service';
import { MessageService } from 'primeng/api';
import { forkJoin, map, switchMap } from 'rxjs';
import { Cart, CartItem } from '@app/core/models/Cart.model';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [MessageService],
})
export class ProductDetailComponent implements OnInit {
  product?: Product; // Make the product property optional with '?'
  loading = true;
  selectedImage?: string;
  imageUrls: string[] = [];
  selectedSize?: string;
  selectedColor?: string;
  quantity: number = 1;
  quantityError: string = '';
  availableSizes: string[] = [];
  availableColors: string[] = [];
  availableVariants: ProductVariant[] = [];
  recommendedProducts: Product[] = [];
  cart: Cart | null = null;
  isCartLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService,
    private cartService: CartService,
    private appState: AppStateService
  ) {
    // Thêm sự kiện lắng nghe khi hoàn thành điều hướng
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Cuộn lên đầu trang
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    // Cuộn lên đầu trang khi component khởi tạo
    window.scrollTo(0, 0);

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
          // Cuộn lên đầu trang khi nhận dữ liệu sản phẩm mới
          window.scrollTo(0, 0);
          this.product = response.data;
          this.loadProductImages();
          this.extractVariantOptions();
          // Load recommended products after we have the current product
          this.loadRecommendedProducts();
        },
        error: (err) => {
          console.error('Error fetching product:', err);
          this.loading = false;
        },
      });

    // Subscribe to cart updates from AppState
    this.appState.cart$.subscribe((cart) => {
      this.cart = cart;
    });

    // Load cart if not available in AppState
    if (!this.cart) {
      this.loadCart();
    }
  }

  loadCart(): void {
    this.cartService.getorInitCart().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.cart = response.data;

          // Ensure cartItems is never undefined
          if (this.cart && !this.cart.cartItems) {
            this.cart.cartItems = [];
          }

          // Only update AppState if cart exists
          if (this.cart) {
            this.appState.updateCart(this.cart);
          }
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        // Don't initialize an empty cart here - let the backend handle it
        // We don't want to override the server-generated IDs
      },
    });
  }

  loadProductImages(): void {
    if (this.product?.productImages && this.product.productImages.length > 0) {
      // Filter out images without a fileId before mapping
      const validImages = this.product.productImages.filter(
        (image) => !!image.fileId && !image.deleted
      );

      if (validImages.length === 0) {
        console.warn('No valid product images found');
        this.loading = false;
        return;
      }

      const imageObservables = validImages.map((image) =>
        this.fileUploadService.getFile(image.fileId as string)
      );

      forkJoin(imageObservables).subscribe({
        next: (responses) => {
          this.imageUrls = responses.map((res) => res.data.url);

          // Find avatar image if available
          const avatarImage = validImages.find((img) => img.avatar);
          if (avatarImage) {
            const avatarIndex = validImages.findIndex(
              (img) => img.fileId === avatarImage.fileId
            );
            if (avatarIndex >= 0) {
              // Put avatar image first
              this.selectedImage = this.imageUrls[avatarIndex];
            } else {
              this.selectedImage = this.imageUrls[0];
            }
          } else {
            this.selectedImage = this.imageUrls[0];
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading images:', err);
          this.loading = false;
        },
      });
    } else {
      console.warn('No product images available');
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
      this.quantityError = '';
    }
  }

  increaseQuantity(): void {
    const availableQty = this.getAvailableQuantity();
    if (this.quantity < availableQty) {
      this.quantity++;
      this.quantityError = '';
    } else {
      this.quantityError = '';
      this.messageService.add({
        severity: 'warn',
        summary: 'Số lượng hạn chế',
        detail: `Chỉ có ${availableQty} sản phẩm có sẵn`,
        life: 3000,
      });
    }
  }

  addToCart(): void {
    const availableQty = this.getAvailableQuantity();

    // Validate quantity
    if (this.quantity <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Số lượng phải lớn hơn 0',
        life: 3000,
      });
      return;
    }

    if (availableQty <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Sản phẩm hết hàng',
        detail: 'Sản phẩm đã hết hàng',
        life: 3000,
      });
      return;
    }

    if (this.quantity > availableQty) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Số lượng hạn chế',
        detail: `Chỉ có ${availableQty} sản phẩm có sẵn`,
        life: 3000,
      });
      return;
    }

    // Get the selected variant
    const variant = this.getSelectedVariant();

    // Enhanced validation to ensure cart and cartItems exist
    if (!variant || !variant.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail:
          'Không tìm thấy biến thể sản phẩm. Vui lòng chọn kích thước và màu sắc.',
        life: 3000,
      });
      return;
    }

    if (!this.product) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không tìm thấy thông tin sản phẩm. Vui lòng thử lại.',
        life: 3000,
      });
      return;
    }

    // Make sure cart exists and initialize it if needed
    if (!this.cart) {
      // If cart doesn't exist, we need to create or load it first
      this.isCartLoading = true;
      this.loadCart();
      this.messageService.add({
        severity: 'info',
        summary: 'Đang xử lý',
        detail: 'Đang chuẩn bị giỏ hàng. Vui lòng thử lại sau vài giây.',
        life: 3000,
      });
      return;
    }

    // Log cart info before updating
    console.log('Cart before update - ID:', this.cart.id);
    console.log('Cart user ID:', this.cart.userId);

    // Make sure cartItems exists
    if (!this.cart.cartItems) {
      this.cart.cartItems = [];
    }

    // Now we can safely use find on cartItems
    const existingItem = this.cart.cartItems.find(
      (item) => item.productVariantId === variant.id && !item.deleted
    );

    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += this.quantity;
      existingItem.deleted = false;
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        productId: this.product.id!, // Add product ID here
        productVariantId: variant.id,
        quantity: this.quantity,
        deleted: false,
        name: this.product.name || 'Sản phẩm',
        originPrice: this.product.originPrice || 0,
        discountPrice:
          this.product.discountPrice || this.product.originPrice || 0,
        discountPercent: this.product.discountPercentage || 0,
        discountType: 0,
        avatarId: this.product.avatarId || '',
        // Add variant size and color
        size: this.selectedSize,
        color: this.selectedColor,
      };
      this.cart.cartItems.push(newItem);
    }

    // Before updating the cart, filter out any deleted items
    if (this.cart) {
      // Filter out deleted items before sending to backend
      const filteredCartItems = this.cart.cartItems.filter(
        (item) => !item.deleted
      );

      // Create a new cart object for the update
      const cartForUpdate: Cart = {
        id: this.cart.id,
        userId: this.cart.userId,
        cartItems: filteredCartItems, // Only sending active items to backend
      };

      console.log(
        `Sending ${filteredCartItems.length} items to backend (filtered out deleted items)`
      );

      // Update cart in backend
      this.cartService.updateCart(cartForUpdate).subscribe({
        next: (response) => {
          console.log('Cart update response:', response);
          // Update cart in AppState
          if (response && response.data) {
            this.cart = response.data;
            this.appState.updateCart(this.cart!);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Thêm vào giỏ hàng',
            detail: 'Sản phẩm đã được thêm vào giỏ hàng',
            life: 3000,
          });
        },
        error: (err) => {
          console.error('Error updating cart:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật giỏ hàng. Vui lòng thử lại.',
            life: 3000,
          });
        },
      });
    }
  }

  addToCartFromRecommended(product: Product): void {
    // Enhanced validation to ensure cart exists
    if (!product) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không tìm thấy thông tin sản phẩm.',
        life: 3000,
      });
      return;
    }

    if (!this.cart) {
      // Initialize cart if it doesn't exist
      this.cart = { userId: '', cartItems: [] };
      this.loadCart();
      this.messageService.add({
        severity: 'info',
        summary: 'Đang xử lý',
        detail: 'Đang chuẩn bị giỏ hàng. Vui lòng thử lại sau vài giây.',
        life: 3000,
      });
      return;
    }

    // Make sure cartItems exists
    if (!this.cart.cartItems) {
      this.cart.cartItems = [];
    }

    // Default values for size and color if the product has variants
    if (product.productVariants && product.productVariants.length > 0) {
      const firstVariant = product.productVariants[0];

      if (!firstVariant.id) {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không tìm thấy phiên bản sản phẩm',
          life: 3000,
        });
        return;
      }

      // Check if product variant already exists in cart
      const existingItem = this.cart.cartItems.find(
        (item) => item.productVariantId === firstVariant.id && !item.deleted
      );

      if (existingItem) {
        // Update quantity if item already exists
        existingItem.quantity += 1;
        existingItem.deleted = false;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          productId: product.id!, // Add product ID here
          productVariantId: firstVariant.id,
          quantity: 1,
          deleted: false,
          name: product.name || 'Sản phẩm',
          originPrice: product.originPrice || 0,
          discountPrice: product.discountPrice || product.originPrice || 0,
          discountPercent: product.discountPercentage || 0,
          discountType: 0,
          avatarId: product.avatarId || '',
        };
        this.cart.cartItems.push(newItem);
      }

      // Update cart in backend - Fix the null error by ensuring cart is not null
      if (this.cart) {
        // Create a new cart object to ensure we preserve ID and userId
        const cartForUpdate: Cart = {
          id: this.cart.id, // Ensure cart ID is included
          userId: this.cart.userId, // Ensure user ID is included
          cartItems: this.cart.cartItems,
        };

        console.log('Recommended add - Cart ID:', cartForUpdate.id);
        console.log('Recommended add - User ID:', cartForUpdate.userId);

        this.cartService.updateCart(cartForUpdate).subscribe({
          next: (res) => {
            // Update cart in AppState
            if (res && res.data) {
              this.appState.updateCart(res.data);
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Thêm vào giỏ hàng',
              detail: `Đã thêm ${product.name} vào giỏ hàng`,
              life: 3000,
            });
          },
          error: (err) => {
            console.error('Error updating cart:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể cập nhật giỏ hàng. Vui lòng thử lại.',
              life: 3000,
            });
          },
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể cập nhật giỏ hàng. Vui lòng thử lại.',
          life: 3000,
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Sản phẩm không có phiên bản',
        life: 3000,
      });
    }
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

  loadRecommendedProducts(): void {
    if (this.product?.categoryId) {
      const searchRequest: ProductSearchRequest = {
        keyword: '',
        categoryId: this.product.categoryId,
        hidden: false,
        sortBy: 'name.sort',
        pageIndex: 1,
        pageSize: 8, // Tăng kích thước trang lên 8 để đảm bảo có đủ sản phẩm sau khi lọc
        sortDirection: 'asc',
      };

      this.productService.searchProducts(searchRequest).subscribe({
        next: (response) => {
          console.log('Tổng số sản phẩm từ tìm kiếm:', response.data.length);

          // Lọc bỏ sản phẩm hiện tại
          const filteredProducts = response.data.filter(
            (p) => p.id !== this.product?.id
          );
          console.log(
            'Sau khi lọc sản phẩm hiện tại:',
            filteredProducts.length
          );

          // Chỉ lấy 4 sản phẩm đầu tiên
          this.recommendedProducts = filteredProducts.slice(0, 4);
          console.log(
            'Số lượng sản phẩm đề xuất cuối cùng:',
            this.recommendedProducts.length
          );

          // Tải hình ảnh cho sản phẩm đề xuất
          this.recommendedProducts.forEach((product) => {
            if (product.productImages && product.productImages.length > 0) {
              const avatarImage = product.productImages.find(
                (img) => img.avatar
              );
              const imageId = avatarImage
                ? avatarImage.fileId
                : product.productImages[0].fileId;

              if (imageId) {
                this.fileUploadService.getFile(imageId).subscribe((res) => {
                  product.imageUrl = res.data.url;
                });
              }
            } else if (product.avatarId) {
              this.fileUploadService
                .getFile(product.avatarId)
                .subscribe((res) => {
                  product.imageUrl = res.data.url;
                });
            }
          });
        },
        error: (err) => {
          console.error('Error loading recommended products:', err);
        },
      });
    }
  }

  navigateToProductDetail(productId: string | undefined): void {
    if (productId) {
      this.router.navigate(['/product-detail', productId]);
    }
  }
}
