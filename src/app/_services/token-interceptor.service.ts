import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private storage: Storage) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storage.get("token")).pipe(
      mergeMap((token) => {
        const newRequest = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token
          }
        });
        return next.handle(newRequest);
      })
    );
  }
}
