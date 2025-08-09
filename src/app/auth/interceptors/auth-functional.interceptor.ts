import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    console.log('🔍 Intercepteur appelé pour:', req.url);

    if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('token');

        if (token) {
            console.log('✅ Token trouvé:', token.substring(0, 20) + '...');

            // Vérifier si le token est expiré
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                const isExpired = payload.exp < currentTime;

                if (isExpired) {
                    console.log('⚠️ Token expiré!');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    return next(req);
                } else {
                    console.log('✅ Token valide, expiration:', new Date(payload.exp * 1000));
                }
            } catch (error) {
                console.log('❌ Erreur lors de la vérification du token:', error);
                return next(req);
            }

            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });

            console.log('📤 Requête avec Authorization header:', authReq.headers.get('Authorization')?.substring(0, 30) + '...');
            return next(authReq);
        } else {
            console.log('❌ Aucun token trouvé dans localStorage');
        }
    } else {
        console.log('🖥️ Pas dans le navigateur, pas de token ajouté');
    }

    return next(req);
};