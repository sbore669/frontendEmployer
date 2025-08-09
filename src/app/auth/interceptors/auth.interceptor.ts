import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajouter le token d'authentification si disponible
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('Token trouvé:', token);
        console.log('Requête vers:', req.url);
        
        // Vérifier si le token est expiré
        if (this.isTokenExpired(token)) {
          console.log('⚠️ Token expiré! Nettoyage du localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirection vers login sera gérée par le guard
          window.location.href = '/login';
          return next.handle(req);
        } else {
          console.log('✅ Token valide');
        }
        
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        
        console.log('Headers de la requête:', authReq.headers.get('Authorization'));
        return next.handle(authReq);
      } else {
        console.log('Aucun token trouvé dans localStorage');
      }
    }
    
    return next.handle(req);
  }
}