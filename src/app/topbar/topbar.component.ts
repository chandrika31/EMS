import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../theme/theme.service';
//import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(private authService: AuthService, private themeService: ThemeService) { }
  username: string;
  tollFreeNumber: string = 'Toll-free: 8939811111';
  ngOnInit() {
    this.themeService.getActiveTheme();
  }

  // onProfileClicked(event, op: OverlayPanel) {
  //   op.toggle(event);
  //   this.username = this.authService.getLoggedUser().user;
  // }

  onLogout() {
    this.authService.logout();
  }

  setTheme(type) {
    switch (type) {
      case 'G':
        this.themeService.setDarkGreenTheme();
        break;
      case 'Y':
        this.themeService.setLightYellowTheme();
        break;
      case 'B':
        this.themeService.setDarkBlueTheme();
        break;
      case 'R':
        this.themeService.setLightRedTheme();
        break;
    }
  }

}
