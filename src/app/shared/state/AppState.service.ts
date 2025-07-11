import { Injectable } from '@angular/core';
import { Profile } from '../../core/models/Profile.model';
import { Cart } from '../../core/models/Cart.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  // State chứa nhiều loại dữ liệu
  private state: {
    profile: Profile | null;
    cart: Cart | null;
    isLoading: boolean;
    // Có thể thêm nhiều dữ liệu khác
  } = {
    profile: null,
    cart: null,
    isLoading: false,
  };

  // BehaviorSubject cho mỗi loại dữ liệu
  private profileSubject = new BehaviorSubject<Profile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Phương thức cập nhật profile
  updateProfile(profile: Profile) {
    this.state.profile = profile;
    this.profileSubject.next(profile);
  }

  // Phương thức cập nhật cart
  updateCart(cart: Cart) {
    this.state.cart = cart;
    this.cartSubject.next(cart);
  }

  setLoading(isLoading: boolean) {
    this.state.isLoading = isLoading;
    this.loadingSubject.next(isLoading);
  }
}
