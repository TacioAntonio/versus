import * as CryptoJS from 'crypto-js';

import { STATUS } from "./constants";
import { SECRET_TOKEN } from '../../environments/environment';
import { interval, take, map, finalize } from 'rxjs';

/**
 * @description a wrapper used to collect sessionStorage information
 * @param key the key that will store the sessionStorage value
 * @returns will return the value of sessionStorage
 */
export function getSession(key: STATUS): any {
  return sessionStorage.getItem(key);
};

/**
 * @description a wrapper used to insert sessionStorage information
 * @param key the key that will insert the sessionStorage value
 */
export function setSession(key: STATUS, value: string) {
  sessionStorage.setItem(key, value);
}

/**
 * @description a wrapper used to delete sessionStorage information
 * @param key the key that will delete the sessionStorage value
 */
export function deleteSession(key: STATUS) {
  sessionStorage.removeItem(key);
}

/**
 * @description a function used to encode data
 * @param payload the payload that will be encoded
 */
export function encodeData(payload: STATUS) {
  return CryptoJS.AES.encrypt(payload, SECRET_TOKEN).toString();
}

/**
 * @description a function used to decode data
 * @param payload the payload that will be decode
 */
export function decodeData(payload: STATUS) {
  return CryptoJS.AES.decrypt(payload, SECRET_TOKEN).toString(CryptoJS.enc.Utf8);
}


/**
 * @description
 * Creates an observable that emits a sequence of numbers based on the given parameters.
 * The emitted values can be either growing or decreasing based on the 'growing' parameter.
 * A callback function is executed when the observable completes.
 *
 * @param rangeValue - The interval (in milliseconds) between each emission of the observable.
 * @param hops - The number of values to emit before completing.
 * @param growing - If true, the sequence of values will be growing; if false, the sequence will be decreasing.
 * @param callback - A function to execute when the observable completes.
 *
 * @returns An observable that emits a sequence of numbers according to the specified parameters.
 */
export function createCounter(
  rangeValue: number,
  hops: number,
  growing: boolean,
  callback: () => void
) {
  return interval(rangeValue)
    .pipe(
      take(hops),
      map(hop => growing ? hop : hops - 1 - hop),
      finalize(callback)
    );
}
