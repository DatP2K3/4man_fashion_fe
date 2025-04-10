import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  active: boolean;
}

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
  ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss',
})
export class ManageProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchKeyword: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Load dữ liệu mẫu - sau này sẽ được thay thế bằng API call
    this.products = [
      {
        id: 1,
        name: 'Áo Polo Nam Premium',
        price: 299000,
        quantity: 50,
        image: 'assets/images/products/polo-1.jpg',
        active: true,
      },
      {
        id: 2,
        name: 'Quần Jean Slimfit',
        price: 450000,
        quantity: 30,
        image: 'assets/images/products/jean-1.jpg',
        active: true,
      },
      {
        id: 3,
        name: 'Áo Sơ Mi Kẻ Sọc',
        price: 350000,
        quantity: 25,
        image: 'assets/images/products/shirt-1.jpg',
        active: false,
      },
      {
        id: 4,
        name: 'Áo Khoác Bomber',
        price: 650000,
        quantity: 15,
        image: 'assets/images/products/jacket-1.jpg',
        active: true,
      },
      {
        id: 5,
        name: 'Giày Sneaker Classic',
        price: 799000,
        quantity: 20,
        image: 'assets/images/products/shoes-1.jpg',
        active: true,
      },
    ];

    this.filteredProducts = [...this.products];
  }

  searchProducts() {
    if (this.searchKeyword.trim()) {
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  navigateToAddProduct() {
    this.router.navigate(['/admin/products/edit']); // Đảm bảo path đúng với routes
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/products/edit', product.id]); // Điều hướng đến trang sửa sản phẩm
  }

  toggleProductVisibility(product: Product) {
    // Sau này sẽ gọi API để cập nhật trạng thái sản phẩm
    product.active = !product.active;
    // Hiển thị thông báo thành côngt.name}`
    console.log(
      `Đã ${product.active ? 'hiển thị' : 'ẩn'} sản phẩm: ${product.name}`
    );
  }
}
