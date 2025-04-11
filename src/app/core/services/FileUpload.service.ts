import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private apiUploadFileUrl =
    'http://localhost:8686/storage/api/file/upload-only-one';
  private apiGetFileUrl = 'http://localhost:8686/storage/api/public/file';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', 'true');
    formData.append('description', 'Upload image for Product');
    return this.http.post<{ fileId: string }>(this.apiUploadFileUrl, formData);
  }

  getFile(fileId: string): Observable<any> {
    return this.http.get<any>(`${this.apiGetFileUrl}/${fileId}`);
  }
}
