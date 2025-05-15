import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  // Use the stable model - "gemini-pro" is well-supported for most API keys
  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private apiKey = environment.geminiApiKey;

  constructor(private http: HttpClient) {}

  generateProductDescription(keywords: string): Observable<any> {
    // Log the API key (first few characters only for security)
    console.log(
      'Using API key starting with:',
      this.apiKey ? this.apiKey.substring(0, 5) + '...' : 'undefined'
    );

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('skipAuth', 'true'); // Add this line to skip auth token

    const prompt = `Viết một mô tả sản phẩm chuyên nghiệp, hấp dẫn, chi tiết khoảng 300 từ cho sản phẩm với các từ khóa sau: ${keywords}.
    Hãy lập danh sách các tính năng và đặc điểm nổi bật.
    Sử dụng ngôn ngữ thuyết phục, hấp dẫn, với gạch đầu dòng để mô tả các đặc điểm nổi bật.
    Nêu bật lợi ích của sản phẩm đối với người dùng.
    Format bằng HTML với các thẻ p, ul, li, strong. bỏ thẻ html bọc ở ngoài.
    Viết bằng tiếng Việt.`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    // Log full request for troubleshooting
    console.log('Gemini API request:', {
      url: `${this.apiUrl}?key=${this.apiKey.substring(0, 5)}...`,
      body: requestBody,
    });

    const url = `${this.apiUrl}?key=${this.apiKey}`;

    return this.http.post(url, requestBody, { headers }).pipe(
      tap((response) => console.log('Gemini API response received')),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('Gemini API error details:', error);

    if (error.status === 401) {
      console.error('Authentication error with Gemini API - Common causes:');
      console.error('1. API key might be incorrect or invalid');
      console.error('2. The API key might not have permission for this model');
      console.error('3. You might have exceeded your quota');

      // Return a fallback response
      return this.getFallbackResponse();
    } else if (error.status === 400) {
      console.error('Bad request to Gemini API - Check your request format');
      return this.getFallbackResponse();
    } else {
      console.error(`Unexpected error with status ${error.status}`);
      return this.getFallbackResponse();
    }
  }

  private getFallbackResponse(): Observable<any> {
    // Create a fallback response structure that matches what your component expects
    return of({
      candidates: [
        {
          content: {
            parts: [
              {
                text: `<p>Sản phẩm cao cấp với thiết kế hiện đại.</p>
                <p><strong>Tính năng nổi bật:</strong></p>
                <ul>
                  <li>Chất lượng cao, bền bỉ theo thời gian</li>
                  <li>Thiết kế thời trang và hiện đại</li>
                  <li>Dễ dàng sử dụng và bảo quản</li>
                  <li>Phù hợp với nhiều đối tượng</li>
                </ul>
                <p>Sản phẩm sẽ mang đến trải nghiệm tuyệt vời cho người dùng.</p>`,
              },
            ],
          },
        },
      ],
    });
  }
}
