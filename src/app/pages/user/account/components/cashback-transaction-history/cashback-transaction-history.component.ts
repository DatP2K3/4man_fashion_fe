import { Component, OnInit } from '@angular/core';
import { CashbackTransactionService } from '@app/core/services/CashbackTransaction.service';
import {
  CashbackTransaction,
  CashbackTransactionType,
} from '@app/core/models/CashbackTransaction.model';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cashback-transaction-history',
  templateUrl: './cashback-transaction-history.component.html',
  styleUrls: ['./cashback-transaction-history.component.scss'],
  standalone: false,
})
export class CashbackTransactionHistoryComponent implements OnInit {
  transactions: CashbackTransaction[] = [];
  filteredTransactions: CashbackTransaction[] = [];
  allTransactions: CashbackTransaction[] = [];
  loading: boolean = true;

  // Table configuration
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  // Filtering
  dateRangeFilter: Date[] = [];

  // Transaction details dialog
  displayDialog: boolean = false;
  selectedTransaction: CashbackTransaction | null = null;

  constructor(
    private cashbackService: CashbackTransactionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;

    this.cashbackService
      .getUserCashbackHistory()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.allTransactions = data;
          this.transactions = [...data];
          this.totalRecords = this.transactions.length;
          this.first = 0; // Reset to first page
          this.applyPagination();
        },
        error: (err) => {
          console.error('Error loading cashback transactions:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail:
              'Không thể tải lịch sử giao dịch 4ManCash. Vui lòng thử lại sau.',
          });
        },
      });
  }

  getTransactionTypeLabel(type: CashbackTransactionType): string {
    return type === CashbackTransactionType.EARNED
      ? 'Nhận điểm'
      : 'Sử dụng điểm';
  }

  getSeverity(
    type: CashbackTransactionType
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | undefined {
    return type === CashbackTransactionType.EARNED ? 'success' : 'danger';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return !isNaN(d.getTime())
      ? d.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  }

  getAmountWithSign(transaction: CashbackTransaction): string {
    const sign =
      transaction.type === CashbackTransactionType.EARNED ? '+' : '-';
    return `${sign}${this.formatCurrency(transaction.amount)}`;
  }

  paginate(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.applyPagination();
  }

  applyPagination(): void {
    const startIndex = Math.floor(this.first / this.rows) * this.rows;
    const endIndex = startIndex + this.rows;
    this.filteredTransactions = this.transactions.slice(startIndex, endIndex);
  }

  onDateRangeChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allTransactions];

    // Apply date range filter if selected
    if (
      this.dateRangeFilter &&
      this.dateRangeFilter.length === 2 &&
      this.dateRangeFilter[0] &&
      this.dateRangeFilter[1]
    ) {
      const startDate = new Date(this.dateRangeFilter[0]);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(this.dateRangeFilter[1]);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    this.transactions = filtered;
    this.totalRecords = this.transactions.length;
    this.first = 0; // Reset to first page when filtering
    this.applyPagination();
  }

  clearFilters(): void {
    this.dateRangeFilter = [];
    this.transactions = [...this.allTransactions]; // Reset to original data
    this.totalRecords = this.transactions.length;
    this.first = 0; // Reset pagination to first page
    this.applyPagination();
  }

  showTransactionDetails(transaction: CashbackTransaction): void {
    this.selectedTransaction = transaction;
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.selectedTransaction = null;
  }
}
