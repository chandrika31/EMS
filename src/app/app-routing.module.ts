import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './Dashboard/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { BugzillaReportComponent } from './reports/bugzilla-report/bugzilla-report.component';
import { NMSSLAFormComponent } from './Documents/nms-sla-form/nms-sla-form.component';
import { EmsReportComponent } from './reports/ems-report/ems-report.component';
import { IncidentDetailsFormComponent } from './Documents/incident-details-form/incident-details-form.component';
import { IncidentDetailsReportComponent } from './reports/incident-details-report/incident-details-report.component';
import { NewTicketComponent } from './Documents/new-ticket/new-ticket.component';
import { TicketUpdateComponent } from './Documents/ticket-update/ticket-update.component';
import { AllIncidentReportComponent } from './reports/all-incident-report/all-incident-report.component';
import { ShopLiveDetailsComponent } from './Documents/shop-live-details/shop-live-details.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'bugzilla', component: BugzillaReportComponent, canActivate: [AuthGuard] },
  { path: 'nms-sla', component: NMSSLAFormComponent, canActivate: [AuthGuard] },
  { path: 'nms-report', component: EmsReportComponent, canActivate: [AuthGuard] },
  { path: 'incident-form', component: IncidentDetailsFormComponent, canActivate: [AuthGuard] },
  { path: 'incident-report', component: IncidentDetailsReportComponent, canActivate: [AuthGuard] },
  { path: 'NewTicket', component: NewTicketComponent, canActivate: [AuthGuard] },
  { path: 'TicketUpdate', component: TicketUpdateComponent, canActivate: [AuthGuard] },
  { path: 'all-incident-report', component: AllIncidentReportComponent, canActivate: [AuthGuard] },
  { path: 'camera-live-details-form', component: ShopLiveDetailsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
