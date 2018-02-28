import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: object;

  constructor(private _authService: AuthService) { }

  ngOnInit() {
    this.user = this._authService.user;
    console.log(this.user)
  }

}
