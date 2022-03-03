import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChartModule } from 'primeng/chart';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule, RadioControlRegistry } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BlockUIModule } from 'primeng/blockui';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Dashboard/home/home.component';
import { MenubarComponent } from './menubar/menubar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { LoginComponent } from './login/login.component';
import { RestAPIService } from './services/restAPI.service';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './footer/footer.component';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { BugzillaReportComponent } from './reports/bugzilla-report/bugzilla-report.component';
import { ScreenReaderComponent } from './screen-reader/screen-reader.component';
import { NMSSLAFormComponent } from './Documents/nms-sla-form/nms-sla-form.component';
import { DatePipe } from '@angular/common';
import { FilterService, MessageService, PrimeNGConfig } from 'primeng/api';
import { EmsReportComponent } from './reports/ems-report/ems-report.component';
import { MasterDataService } from './masters-services/master-data.service';
import { IncidentDetailsFormComponent } from './Documents/incident-details-form/incident-details-form.component';
import { IncidentDetailsReportComponent } from './reports/incident-details-report/incident-details-report.component';
import { ThemeService } from './theme/theme.service';
import { NewTicketComponent } from './Documents/new-ticket/new-ticket.component';
import { TicketUpdateComponent } from './Documents/ticket-update/ticket-update.component';
import { AllIncidentReportComponent } from './reports/all-incident-report/all-incident-report.component';
import { ShopLiveDetailsComponent } from './Documents/shop-live-details/shop-live-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenubarComponent,
    TopbarComponent,
    LoginComponent,
    FooterComponent,
    BugzillaReportComponent,
    ScreenReaderComponent,
    NMSSLAFormComponent,
    EmsReportComponent,
    IncidentDetailsFormComponent,
    IncidentDetailsReportComponent,
    NewTicketComponent,
    TicketUpdateComponent,
    AllIncidentReportComponent,
    ShopLiveDetailsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DropdownModule,
    CheckboxModule,
    TabMenuModule,
    TableModule,
    ChartModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    PanelModule,
    ButtonModule,
    ReactiveFormsModule,
    SidebarModule,
    ProgressSpinnerModule,
    CalendarModule,
    OverlayPanelModule,
    ToastModule,
    SelectButtonModule,
    BlockUIModule,
    SplitButtonModule,
    MenubarModule,
    DialogModule,
    TabViewModule
  ],
  providers: [AuthService, RestAPIService, DatePipe, MessageService, MasterDataService, ThemeService,
    PrimeNGConfig, FilterService, RadioControlRegistry],
  bootstrap: [AppComponent]
})
export class AppModule { }
