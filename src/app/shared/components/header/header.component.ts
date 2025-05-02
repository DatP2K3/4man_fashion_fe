import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Profile } from '../../../core/models/Profile.model';
import { Cart, CartItem } from '../../../core/models/Cart.model';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../core/services/Profile.service';
import { CartService } from '../../../core/services/Cart.service';
import { AppStateService } from '../../state/AppState.service';
import { ImageCacheService } from '@app/core/services/ImageCache.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: false,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public visible: boolean = false;
  public cartVisible: boolean = false;
  public isLoggedIn = false;
  public profile: Profile | null = null;
  public cart: Cart | null = null;
  public isCartLoading: boolean = false;
  public isImagesLoading: boolean = false; // New flag to track image loading separately

  private profileSubscription: Subscription | null = null;
  private cartSubscription: Subscription | null = null;

  constructor(
    private readonly keycloak: KeycloakService,
    private profileService: ProfileService,
    private cartService: CartService,
    private appState: AppStateService,
    private imageCacheService: ImageCacheService // Replace FileUploadService with ImageCacheService
  ) {}

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    // Subscribe to AppState to get cart and profile updates
    this.cartSubscription = this.appState.cart$.subscribe((cart) => {
      this.cart = cart;
    });

    this.profileSubscription = this.appState.profile$.subscribe((profile) => {
      this.profile = profile;
    });

    // Automatically load cart data when component initializes if user is logged in
    if (this.isLoggedIn) {
      this.loadCartData();
    }
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }

    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  public login() {
    this.keycloak.login();
  }

  public accountManagement() {
    this.keycloak.getKeycloakInstance().accountManagement();
  }

  public async openProfileDrawer() {
    if (this.isLoggedIn) {
      if (!this.profile) {
        await this.profileService.getOrInit().subscribe({
          next: (response: any) => {
            if (response && response.data) {
              this.profile = response.data;
              // Fix: Add null check before calling updateProfile
              if (this.profile) {
                this.appState.updateProfile(this.profile);
              }
            }
          },
          error: (error) => {
            console.error('Error fetching profile data:', error);
          },
        });
      }
    }
    this.visible = true;
  }

  public openCartPopup() {
    if (this.isLoggedIn) {
      // Always show the cart drawer immediately
      this.cartVisible = true;

      // If we don't have a cart yet, create a temporary empty cart object
      // This prevents the loading state from showing
      if (!this.cart) {
        // Create a temporary empty cart to avoid null state
        this.cart = {
          id: '',
          userId: '',
          cartItems: [],
        };

        // Then load the actual data in the background
        this.loadCartData();
      }
    } else {
      this.keycloak.login();
    }
  }

  // Optional method to force refresh cart data from server
  public refreshCartData() {
    this.isCartLoading = true;
    this.loadCartData();
  }

  private loadCartData() {
    // Still track loading state internally (for other purposes if needed)
    this.isCartLoading = true;
    this.cartService.getorInitCart().subscribe({
      next: (response) => {
        this.isCartLoading = false;

        if (response && response.data) {
          this.cart = response.data;

          if (this.cart) {
            // Update app state immediately so UI can render
            this.appState.updateCart(this.cart);

            // Handle image loading separately
            this.loadCartImages();
          }
        }
      },
      error: (error) => {
        console.error('Error fetching cart data:', error);
        this.isCartLoading = false;
      },
    });
  }

  // New separate method for handling images
  private loadCartImages(): void {
    if (!this.cart?.cartItems) return;

    // Prepare to prefetch all images at once
    const avatarIds = this.cart
      .cartItems!.filter((item) => item.avatarId && !item.deleted)
      .map((item) => item.avatarId);

    if (avatarIds.length === 0) return;

    this.isImagesLoading = true;

    // Apply any already cached images immediately
    this.applyImagesFromCache();

    // Prefetch all images at once
    this.imageCacheService.prefetchImages(avatarIds);

    // Still load any uncached images asynchronously
    setTimeout(() => {
      this.loadCartItemImages();
      this.isImagesLoading = false;
    }, 0);
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

  // Optimize image loading with cache
  private loadCartItemImages(): void {
    if (!this.cart?.cartItems) return;

    this.cart.cartItems.forEach((item) => {
      if (item.avatarId && !item.imageUrl) {
        // Check if image is in cache
        if (this.imageCacheService.hasImage(item.avatarId)) {
          // If image is in cache, set it directly
          item.imageUrl = this.imageCacheService.getCachedImage(item.avatarId);
        } else {
          // Otherwise load it through the cache service
          this.imageCacheService.getImage(item.avatarId).subscribe({
            next: (url) => {
              item.imageUrl = url;
            },
            error: (err) => {
              console.error(`Error loading image for cart item:`, err);
            },
          });
        }
      }
    });
  }

  // Helper methods for cart item filtering
  getVisibleCartItems(): CartItem[] {
    if (!this.cart || !this.cart.cartItems) {
      return [];
    }
    console.log('Filtering cart items:', this.cart.cartItems);
    return this.cart.cartItems.filter((item) => !item.deleted);
  }

  hasVisibleCartItems(): boolean {
    return this.getVisibleCartItems().length > 0;
  }

  getVisibleCartItemCount(): number {
    return this.getVisibleCartItems().length;
  }

  public calculateTotal(): number {
    return this.getVisibleCartItems().reduce((total, item) => {
      // Use discountPrice if it exists and is greater than 0, otherwise use originPrice
      const price =
        item.discountPrice && item.discountPrice > 0
          ? item.discountPrice
          : item.originPrice;
      return total + price * item.quantity;
    }, 0);
  }

  public getCartItemCount(): string {
    const count = this.getVisibleCartItemCount();
    return count > 0 ? count.toString() : '';
  }

  public removeCartItem(itemId: string): void {
    if (!itemId || !this.cart) return;

    // Removed setting isCartLoading = true here to avoid UI flicker

    console.log('Header - Removing item from cart with ID:', this.cart.id);

    // Find the item and mark it as deleted for local filtering
    const itemToDelete = this.cart.cartItems!.find(
      (item) => item.id === itemId
    );
    if (itemToDelete) {
      // Mark as deleted for local state immediately (for instant UI feedback)
      itemToDelete.deleted = true;

      // Create a filtered cart for the update request (without deleted items)
      const filteredCartItems = this.cart.cartItems!.filter(
        (item) => !item.deleted
      );

      // Create cart object for backend update
      const cartForUpdate: Cart = {
        id: this.cart.id,
        userId: this.cart.userId,
        cartItems: filteredCartItems, // Only non-deleted items
      };

      // Update cart in backend
      this.cartService.updateCart(cartForUpdate).subscribe({
        next: (response) => {
          if (response && response.data) {
            this.cart = response.data;
            this.appState.updateCart(response.data);
          }
          this.isCartLoading = false;
        },
        error: (error) => {
          console.error('Error removing item from cart:', error);
          this.isCartLoading = false;
          // Revert delete operation on error (optional)
          if (itemToDelete) {
            itemToDelete.deleted = false;
          }
        },
      });
    }
  }

  public goToCart() {
    this.cartVisible = false;
  }
}
