import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrudHttpService {

  constructor(private httpClient: HttpClient) { }

  get<T>(urlBase: string){
    return new CrudtHttp<T>(this.httpClient, urlBase);
  }
}


export class CrudtHttp<T>{
  baseUrl: string;
  
  constructor(private http: HttpClient, baseUrl){
    this.baseUrl = baseUrl;
  }

  list(){
    return this.http.get<T[]>(this.baseUrl);
  }

  
  retrieve(id: number | string){
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(data:T, id: number | string){
    return this.http.post<T>(`${this.baseUrl}`, data);
  }

  update(data: T, id: number | string){
    return this.http.put<T>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string | number){
    return this.http.delete<T>(`${this.baseUrl}/${id}`);
  }
}