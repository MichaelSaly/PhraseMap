import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebService {

    // private baseURL = 'http://localhost:80/requests';
    private baseURL = '/requests';
    
    private headers = new HttpHeaders().set('Content-Type', 'application/json')


    constructor(private http: HttpClient) { }

    onChooseLocation(longitude, latitude) {
        let x = {
            'longitude': longitude,
            'latitude': latitude
        }

        return this.http.post(this.baseURL + '/coords-str', x, {headers: this.headers})
    }

    generate(phrase) {
        let x = {
            'phrase': phrase
        }

        return this.http.post(this.baseURL + '/str-coords', x, {headers: this.headers})
    }

    linkedEntry(key) {
        let x = {
            'key': key
        }

        return this.http.post(this.baseURL + '/linked-entry', x, {headers: this.headers})
    }

}
