import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  name: string;
  password: string;
  tokenExpires: any;

  constructor(private _authService: AuthService,
              private _router: Router) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    let user = {
      name: this.name,
      password: this.password
    };
    this._authService.onLoginUser(user)
      .subscribe(
        (res) =>{
          console.log(res);
          if (res['success']){
            this._authService.storeUserData(res['token'], res['user']);
            this._router.navigate(['/']);
          } else {
            console.log(`Error on login`);
            this._router.navigate(['/login']);
          }
        }
      )
  }
}
