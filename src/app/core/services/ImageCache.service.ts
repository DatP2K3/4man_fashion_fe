import { Injectable } from '@angular/core';
import { FileUploadService } from './FileUpload.service';
import { Observable, of, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageCacheService {
  private imageCache = new Map<string, string>();
  private localStorageKey = '4man_image_cache';
  private maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private isInitialized = false;

  constructor(private fileUploadService: FileUploadService) {
    this.loadCacheFromStorage();
  }

  private loadCacheFromStorage(): void {
    if (this.isInitialized) return;

    try {
      const cachedData = localStorage.getItem(this.localStorageKey);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (
          parsed.timestamp &&
          Date.now() - parsed.timestamp < this.maxCacheAge
        ) {
          // Only load cache if it's not too old
          const cacheEntries = parsed.entries || {};
          Object.keys(cacheEntries).forEach((key) => {
            this.imageCache.set(key, cacheEntries[key]);
          });
          console.log(`Loaded ${this.imageCache.size} images from cache`);
        } else {
          // Cache is too old, clear it
          localStorage.removeItem(this.localStorageKey);
        }
      }
    } catch (e) {
      console.error('Error loading image cache from storage', e);
    } finally {
      this.isInitialized = true;
    }
  }

  private saveToStorage(): void {
    try {
      const entries: Record<string, string> = {};
      this.imageCache.forEach((value, key) => {
        entries[key] = value;
      });

      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify({
          timestamp: Date.now(),
          entries,
        })
      );
    } catch (e) {
      console.error('Error saving image cache to storage', e);
    }
  }

  /**
   * Get image URL from cache or load it
   * @param fileId The file ID to load
   * @returns Observable with the image URL
   */
  getImage(fileId: string): Observable<string> {
    // If image is in cache, return it immediately
    if (this.imageCache.has(fileId)) {
      return of(this.imageCache.get(fileId)!);
    }

    // Otherwise load it and cache it
    return this.fileUploadService.getFile(fileId).pipe(
      map((response) => {
        if (response?.data?.url) {
          this.imageCache.set(fileId, response.data.url);
          // Save to localStorage after updating cache
          this.saveToStorage();
          return response.data.url;
        }
        return '';
      }),
      catchError((error) => {
        console.error(`Error loading image for ID ${fileId}:`, error);
        return of(''); // Return empty string on error
      })
    );
  }

  /**
   * Pre-fetch multiple images at once and store them in cache
   * @param fileIds Array of file IDs to load
   */
  prefetchImages(fileIds: string[]): void {
    // Filter out IDs that are already cached
    const idsToFetch = fileIds.filter((id) => id && !this.imageCache.has(id));

    // Fetch each image
    idsToFetch.forEach((id) => {
      this.getImage(id).subscribe();
    });
  }

  /**
   * Check if image is in cache
   * @param fileId The file ID to check
   * @returns True if image exists in cache
   */
  hasImage(fileId: string): boolean {
    return this.imageCache.has(fileId);
  }

  /**
   * Get image from cache without loading
   * @param fileId The file ID to get
   * @returns The cached URL or undefined
   */
  getCachedImage(fileId: string): string | undefined {
    return this.imageCache.get(fileId);
  }

  /**
   * Clear old entries from cache
   */
  clearOldCache(): void {
    localStorage.removeItem(this.localStorageKey);
    this.imageCache.clear();
  }
}
