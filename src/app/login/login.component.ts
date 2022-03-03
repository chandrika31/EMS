import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PathConstants } from '../Helper/PathConstants';
import { RestAPIService } from '../services/restAPI.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  loginForm: FormGroup;
  pwdResetForm: FormGroup;
  isSubmitted: boolean;
  clickedReset: boolean;
  emailId: string;
  showPwdNoMatchErr: boolean;
  showPswd: boolean;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router,
    private restApiService: RestAPIService, private messageService: MessageService) { }

  ngOnInit() {
    this.isSubmitted = false;
    this.clickedReset = false;
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      pswd: ['', Validators.required]
    });
    this.pwdResetForm = this.fb.group({
      email: ['', Validators.required]
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    this.restApiService.getByParameters(PathConstants.LoginURL, { 'username': this.username }).subscribe(credentials => {
      if (credentials.length !== 0 && credentials !== null && credentials !== undefined) {
        if(credentials[0].role_id !== 3 && credentials[0].role_id !== 4) {
        if (this.username.toLowerCase().trim() === credentials[0].login_name.toLowerCase().trim() &&
          this.password.toLowerCase().trim() === credentials[0].userpwd.toLowerCase().trim()) {
          var obj = this.loginForm.value;
          obj['Id'] = credentials[0].userid;
          obj['RoleId'] = credentials[0].role_id;
          obj['Region'] = (credentials[0].role_id === 3 || credentials[0].role_id === 4) ? credentials[0].REGNNAME : '';
          obj['District'] = (credentials[0].role_id === 4) ? credentials[0].Dname : '';
          obj['RCode'] = (credentials[0].role_id === 3 || credentials[0].role_id === 4) ? credentials[0].RegionID : '';
          obj['DCode'] = (credentials[0].role_id === 4) ? credentials[0].DistrictID : '';
          obj['RealName'] = credentials[0].realname;
          this.authService.loginInfo(obj);
          this.router.navigate(['/home']);
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'error',
            summary: 'Error Message', detail: 'Please enter valid credentials!'
          });
        }
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Invalid user!'
        });
      }
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 't-err', severity: 'error',
        summary: 'Error Message', detail: 'Please contact administrator!'
      });
    }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please Contact Administrator!'
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please check your network connection!'
        });
      }
    });
  }

  onForgotPassword() {
    const params = {
      'MailId': this.emailId
    }
  }

  openPwdReset() {
    this.clickedReset = true;
  }

  onShowPswd() {
    var inputValue = (<HTMLInputElement>document.getElementById('pswd'));
    if (inputValue.type === 'password') {
      inputValue.type = 'text';
      this.showPswd = !this.showPswd;
    } else {
      this.showPswd = !this.showPswd;
      inputValue.type = 'password';
    }
  }
}


