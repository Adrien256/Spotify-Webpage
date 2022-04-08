import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import RegisterUser from '../RegisterUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerUser:RegisterUser = new RegisterUser();
  public warning: string = "";
  public success: boolean = false;
  public loading: boolean = false;

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit(): void {}

  onSubmit(f: NgForm): void{
      if(this.registerUser.userName != "" && this.registerUser.password != ""){
        this.loading = true;
        console.log(this.registerUser);
        this.auth.register(this.registerUser).subscribe(
          (Psuccess) => {
            console.log("S");
            this.success = true;
            this.warning = "";
            this.loading = false;
          },
          (err) => {
            console.log("F");
            this.success = false;
            this.warning = err.error.message;
            this.loading = false;
          }
        )
      }
      else{
        this.warning = "Please fill in all fields";
      }
  }
}
