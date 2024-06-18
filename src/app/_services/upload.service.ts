import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  upload(files:File[]) {
    let formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
        if (files[i] != null) {
            formData.append(`Image${i + 1}`, files[i], files[i].name);
        }
    }
    return formData;
  }
}
