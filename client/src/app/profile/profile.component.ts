import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  selectedFile: File = null;
  hobby: string;


  constructor(private _authService: AuthService) {
  }

  ngOnInit() {
    this.user = this._authService.getUser();
  }

  onFileSelected(event) {
    if (event.target.files.length !== 0) {
      this.selectedFile = <File>event.target.files[0];
      console.log(this.selectedFile);
    } else {
      this.selectedFile = null;
      console.log(this.selectedFile);
    }

  }

  onImageUpload() {
    if (this.selectedFile !== null) {
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      fd.append('hobby', this.hobby);
      this._authService.uploadUserData(fd).subscribe(
        (res) => {
          console.log(res);
        }
      )
    }
  }

}
