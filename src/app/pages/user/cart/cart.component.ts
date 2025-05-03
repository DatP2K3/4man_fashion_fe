import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '@app/core/services/Cart.service';
import { Cart, CartItem } from '@app/core/models/Cart.model';
import { AppStateService } from '@app/shared/state/AppState.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ImageCacheService } from '@app/core/services/ImageCache.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  isLoading: boolean = true;
  private cartSubscription: Subscription | null = null;
  displayedCartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private appState: AppStateService,
    private messageService: MessageService,
    private imageCacheService: ImageCacheService // Replace FileUploadService with ImageCacheService
  ) {}

  ngOnInit(): void {
    // First check if cart exists in AppState
    this.cartSubscription = this.appState.cart$.subscribe((cart) => {
      if (cart) {
        this.cart = cart;
        this.filterDisplayedItems();
        this.isLoading = false;
      } else {
        // If not in AppState, load from backend
        this.loadCart();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getorInitCart().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.cart = response.data;

          if (this.cart && this.cart.id) {
            // Prepare to prefetch all images at once
            const avatarIds =
              this.cart?.cartItems
                ?.filter((item) => item.avatarId && !item.deleted)
                .map((item) => item.avatarId) || [];

            // Prefetch all images at once
            this.imageCacheService.prefetchImages(avatarIds);

            // Set loading to false
            this.isLoading = false;
            this.filterDisplayedItems();

            // Update AppState
            if (this.cart) {
              this.appState.updateCart(this.cart);
            }

            // Apply cached images immediately instead of loading asynchronously
            this.applyImagesFromCache();
          } else {
            this.isLoading = false;
            this.filterDisplayedItems();
          }
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải giỏ hàng. Vui lòng thử lại sau.',
        });
      },
    });
  }

  // New method to apply cached images immediately
  private applyImagesFromCache(): void {
    if (!this.cart?.cartItems) return;

    this.cart.cartItems.forEach((item) => {
      if (item.avatarId && !item.imageUrl) {
        if (this.imageCacheService.hasImage(item.avatarId)) {
          item.imageUrl = this.imageCacheService.getCachedImage(item.avatarId);
        }
      }
    });
  }

  // Update this method to be more robust
  private loadCartItemImages(): void {
    if (!this.cart?.cartItems) return;

    // First apply any cached images immediately
    this.applyImagesFromCache();

    // Then load any missing images
    this.cart.cartItems
      .filter((item) => item.avatarId && !item.imageUrl && !item.deleted)
      .forEach((item) => {
        this.imageCacheService.getImage(item.avatarId).subscribe({
          next: (url) => {
            if (url) {
              item.imageUrl = url;
              // Force change detection if needed
              this.filterDisplayedItems();
            }
          },
          // Error handled in ImageCacheService
        });
      });
  }

  filterDisplayedItems(): void {
    if (this.cart && this.cart.cartItems) {
      // Only show items where deleted=false (active items)
      this.displayedCartItems = this.cart.cartItems.filter(
        (item) => !item.deleted
      );
    } else {
      this.displayedCartItems = [];
    }
  }

  calculateTotal(): number {
    if (!this.displayedCartItems) {
      return 0;
    }
    return this.displayedCartItems.reduce((total, item) => {
      // Use discountPrice if it exists, otherwise use originPrice
      const price = item.discountPrice ? item.discountPrice : item.originPrice;
      return total + price * item.quantity;
    }, 0);
  }

  // Also optimize the removeItem method
  removeItem(itemId: string): void {
    if (!itemId || !this.cart) return;

    this.isLoading = true;

    // Store current imageUrls for all non-deleted cart items to preserve them
    const imageMap = new Map<string, string>();
    this.cart.cartItems!.forEach((item) => {
      if (item.avatarId && item.imageUrl) {
        imageMap.set(item.avatarId, item.imageUrl);
      }
    });

    // Mark the item to be deleted (for local filtering)
    const itemToDelete = this.cart.cartItems!.find(
      (item) => item.id === itemId
    );
    if (itemToDelete) {
      itemToDelete.deleted = true;
      // Create a new cartItems array WITHOUT the deleted item
      const filteredCartItems = this.cart.cartItems!.filter(
        (item) => !item.deleted
      );

      // Create a cart for update that excludes deleted items
      const cartForUpdate: Cart = {
        id: this.cart.id,
        userId: this.cart.userId,
        cartItems: filteredCartItems, // Only sending active items to backend
      };

      // Update cart in backend
      this.cartService.updateCart(cartForUpdate).subscribe({
        next: (response) => {
          if (response && response.data) {
            this.cart = response.data;

            // Restore images from our map
            this.cart?.cartItems!.forEach((item) => {
              if (item.avatarId && imageMap.has(item.avatarId)) {
                item.imageUrl = imageMap.get(item.avatarId);
              }
            });

            this.filterDisplayedItems();
            this.appState.updateCart(response.data);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã xóa sản phẩm khỏi giỏ hàng',
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating cart:', error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể xóa sản phẩm. Vui lòng thử lại sau.',
          });
        },
      });
    } else {
      this.isLoading = false;
    }
  }

  // Update cart method - No need for complex DOM operation anymore
  updateCartItem(item: CartItem): void {
    if (!this.cart) return;

    // Find the actual item in the cart
    const cartItem = this.cart.cartItems!.find((ci) => ci.id === item.id);
    if (cartItem) {
      cartItem.quantity = item.quantity;

      // Store current imageUrls for all cart items to preserve them
      const imageMap = new Map<string, string>();
      this.cart.cartItems!.forEach((item) => {
        if (item.avatarId && item.imageUrl) {
          imageMap.set(item.avatarId, item.imageUrl);
        }
      });

      // Create a NEW cartItems array WITHOUT any deleted items
      const filteredCartItems = this.cart.cartItems!.filter(
        (item) => !item.deleted
      );

      // Create a cart for update that excludes deleted items
      const cartForUpdate: Cart = {
        id: this.cart.id,
        userId: this.cart.userId,
        cartItems: filteredCartItems, // Only sending active items to backend
      };

      // Update cart in backend
      this.cartService.updateCart(cartForUpdate).subscribe({
        next: (response) => {
          if (response && response.data) {
            this.cart = response.data;

            // Restore images from our map
            this.cart?.cartItems!.forEach((item) => {
              if (item.avatarId && imageMap.has(item.avatarId)) {
                item.imageUrl = imageMap.get(item.avatarId);
              }
            });

            this.filterDisplayedItems();
            this.appState.updateCart(this.cart!);
          }
        },
        error: (error) => {
          console.error('Error updating cart item:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật số lượng. Vui lòng thử lại sau.',
          });
        },
      });
    }
  }

  checkout(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: 'Chức năng đặt hàng đang được phát triển',
    });
  }
}
