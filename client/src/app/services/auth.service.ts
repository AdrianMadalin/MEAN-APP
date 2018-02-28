import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {JwtHelper} from "../helper.service";

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  isTokenValid;

  constructor(private _httpClient: HttpClient,
              private _jwtHelper: JwtHelper) {
    this.isTokenValid = false;
  }

  onRegisterUser(user) {
    const url = '/register';
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this._httpClient.post(url, user, {headers: headers})
      .map((res) => res)
  }

  onLoginUser(user) {
    const url = '/login';
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this._httpClient.post(url, user, {headers: headers})
      .map((res) => res)
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
    // this.isTokenValid = !this._jwtHelper.isTokenExpired(localStorage.getItem('id_token'));
  }

  logout() {
    this.authToken = null;
    this.user = null;
    this.isTokenValid = false;
    localStorage.clear();
  }

  isAuthenticated() {
    /*
    console.log(this._jwtHelper.decodeToken(token));
    console.log(this._jwtHelper.getTokenExpirationDate(token));
    console.log(this._jwtHelper.isTokenExpired(token));
    */

    let token = localStorage.getItem('id_token');
    if(token !== null) {
      this.isTokenValid = !this._jwtHelper.isTokenExpired(token);
    }

    return this.isTokenValid;
  }


}
