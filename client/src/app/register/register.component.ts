import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string;
  password: string;

  constructor(private _authService: AuthService,
              private _router: Router) {
  }

  ngOnInit() {

  }

  onRegisterSubmit() {
    let user = {
      username: this.name,
      password: this.password
    };
    this._authService.onRegisterUser(user)
      .subscribe(
        (res) => {
          if(res['success']) {
            this._router.navigate(['/']);
          } else {
            console.log('Error');
            this._router.navigate(['/register']);
          }
        }
      )
  }
}
