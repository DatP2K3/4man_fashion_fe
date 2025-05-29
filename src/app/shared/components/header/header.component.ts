import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Profile } from '../../../core/models/Profile.model';
import { Cart, CartItem } from '../../../core/models/Cart.model';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../core/services/Profile.service';
import { CartService } from '../../../core/services/Cart.service';
import { AppStateService } from '../../state/AppState.service';
import { ImageCacheService } from '@app/core/services/ImageCache.service';
import { Category } from '@app/core/models/Category.model';
import { CategoryService } from '@app/core/services/Category.service';
import { ProductService } from '@app/core/services/Product.service'; // Import ProductService chuẩn Angular

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

  // Add these new properties for the dropdown menu
  aoCategories: Category[] = [];
  quanCategories: Category[] = [];
  activeDropdown: string | null = null;
  loadingCategories: boolean = false;

  // Menu items for PrimeNG menu
  aoMenuItems: MenuItem[] = [];
  quanMenuItems: MenuItem[] = [];

  private profileSubscription: Subscription | null = null;
  private cartSubscription: Subscription | null = null;

  // Thêm thuộc tính searchKeyword để lưu từ khóa tìm kiếm
  searchKeyword: string = '';

  // Autocomplete suggestions for header search
  autoCompleteSuggestions: string[] = [];
  showAutoComplete: boolean = false;
  autoCompleteLoading: boolean = false;
  autoCompleteLimit: number = 10;
  autoCompleteDebounce?: any;

  constructor(
    private readonly keycloak: KeycloakService,
    private profileService: ProfileService,
    private cartService: CartService,
    private appState: AppStateService,
    private imageCacheService: ImageCacheService, // Replace FileUploadService with ImageCacheService
    private categoryService: CategoryService,
    private productService: ProductService, // Inject ProductService đúng chuẩn Angular
    private router: Router // Thêm router để điều hướng
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

  // Modified method to show dropdown
  loadCategories(type: string): void {
    this.activeDropdown = type;

    // Cancel any ongoing hide timer
    this.cancelHideDropdown();

    // Load categories if needed
    if (type === 'ao' && this.aoCategories.length === 0) {
      this.loadingCategories = true;
      console.log('Loading Áo categories...');

      this.categoryService.getCategoriesByProductType('Áo').subscribe({
        next: (response) => {
          console.log('Áo categories response:', response);
          if (response && response.success) {
            this.aoCategories = response.data || [];
            console.log('Áo categories loaded:', this.aoCategories);
          }
          this.loadingCategories = false;
        },
        error: (err) => {
          console.error('Error fetching Áo categories:', err);
          this.loadingCategories = false;
        },
      });
    } else if (type === 'quan' && this.quanCategories.length === 0) {
      this.loadingCategories = true;
      console.log('Loading Quần categories...');

      this.categoryService.getCategoriesByProductType('Quần').subscribe({
        next: (response) => {
          console.log('Quần categories response:', response);
          if (response && response.success) {
            this.quanCategories = response.data || [];
            console.log('Quần categories loaded:', this.quanCategories);
          }
          this.loadingCategories = false;
        },
        error: (err) => {
          console.error('Error fetching Quần categories:', err);
          this.loadingCategories = false;
        },
      });
    }

    // Add event listeners for mouseleave
    setTimeout(() => {
      const dropdownMenus = document.querySelectorAll('.dropdown-menu');
      dropdownMenus.forEach((menu) => {
        menu.addEventListener('mouseleave', () => {
          this.activeDropdown = null;
        });
      });
    }, 0);
  }

  // Improved dropdown handling with mouse events
  private dropdownTimer: any = null;
  private isMouseInSubmenu = false;

  // Method to cancel any pending hide dropdowns
  cancelHideDropdown(): void {
    if (this.dropdownTimer) {
      clearTimeout(this.dropdownTimer);
      this.dropdownTimer = null;
    }
  }

  // Handle mouse leave from the entire dropdown container
  handleMouseLeave(type: string): void {
    // Start a timer to hide the dropdown
    this.dropdownTimer = setTimeout(() => {
      // Only hide if the type matches the active dropdown
      // This prevents one dropdown from closing another
      if (this.activeDropdown === type) {
        this.activeDropdown = null;
      }
    }, 100);
  }

  resetDropdown(): void {
    // Add a small delay before hiding to give users time to move to submenu
    this.dropdownTimer = setTimeout(() => {
      this.activeDropdown = null;
    }, 100);
  }

  // When entering the dropdown menu directly, cancel any hide timer
  enterDropdown(): void {
    if (this.dropdownTimer) {
      clearTimeout(this.dropdownTimer);
      this.dropdownTimer = null;
    }
  }

  // Method to navigate to a specific category
  navigateToCategory(
    categoryId: string | undefined,
    productType: string
  ): void {
    if (categoryId) {
      // Will automatically navigate via routerLink in menu items
      console.log(`Navigate to ${productType} category: ${categoryId}`);
    }
  }

  onSearch() {
    const keyword = this.searchKeyword?.trim();
    if (keyword) {
      // Điều hướng đến trang category-products với query param keyword
      this.router.navigate(['/search'], { queryParams: { keyword } });
    }
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  onSearchInput(event: any) {
    const keyword = event.target.value;
    this.searchKeyword = keyword;
    if (this.autoCompleteDebounce) {
      clearTimeout(this.autoCompleteDebounce);
    }
    if (!keyword) {
      this.autoCompleteSuggestions = [];
      this.showAutoComplete = false;
      return;
    }
    this.autoCompleteDebounce = setTimeout(() => {
      this.autoCompleteLoading = true;
      this.productService
        .productAutoComplete(keyword, this.autoCompleteLimit)
        .subscribe({
          next: (suggestions) => {
            this.autoCompleteSuggestions = suggestions;
            this.showAutoComplete = true;
            this.autoCompleteLoading = false;
          },
          error: () => {
            this.autoCompleteSuggestions = [];
            this.showAutoComplete = false;
            this.autoCompleteLoading = false;
          },
        });
    }, 300);
  }

  onSelectSuggestion(suggestion: string) {
    this.searchKeyword = suggestion;
    this.showAutoComplete = false;
    this.onSearch();
  }

  onBlurAutoComplete() {
    setTimeout(() => {
      this.showAutoComplete = false;
    }, 200);
  }
}
