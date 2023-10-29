import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({ providedIn: 'root' })
export class decryptAesService {
    decryptAesCbc(encrypted: any, keyCode: string, IVCode: string): number {

        encrypted = atob(encrypted);
        encrypted=JSON.parse(encrypted);
        const iv = CryptoJS.enc.Base64.parse(encrypted.iv);
    
        const value = encrypted.value;
        const key = CryptoJS.enc.Base64.parse(keyCode);
    
        var decrypted = CryptoJS.AES.decrypt(value, key, {
          iv: iv
        });
    
        let plaintext = decrypted.toString(CryptoJS.enc.Utf8).replaceAll("[^\\d]", '');
        let idArr = plaintext.split(':')
        return parseInt(idArr[1]);
      }

}