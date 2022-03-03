import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { PathConstants } from 'src/app/Helper/PathConstants';
// import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-ticket-update',
  templateUrl: './ticket-update.component.html',
  styleUrls: ['./ticket-update.component.css']
})
export class TicketUpdateComponent implements OnInit {
  TicketReportCols: any = [];
  TicketReportData: any = [];
  showDialog: boolean = false;
  showComment: boolean = false;
  selectedDocId: number;
  Assignee: any;
  DefaultCC: any;
  URL: any;
  Subject: any;
  TicketDescription: any;
  Status: any;
  reporter: any;
  bugStatusData: any = [];
  TDData: any = [];
  TDCols: any = [];
  StatusOptions: SelectItem[];
  TicketID: any;
  TD: any = [];
  AllTD: any = [];
  blockScreen: boolean;
  TT: [];
  login_User: any;
  loading: boolean;
  selected: any;
  Location: any;
  Region: any;
  District: any;
  ShopName: any;
  Component: any;
  ComponentDescription: any;
  dialogHeader: string;
  StatusCode: any;
  StatusLabel: string;
  blockScreen_dialog: boolean;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService,
    private authService: AuthService) { }

  ngOnInit() {
    this.bugStatusData = this.masterDataService.getBugStatus();
    this.login_User = this.authService.getLoggedUser();
    this.onTicket();
    // this.onTD();
    this.TicketReportCols = [
      { field: 'TicketID', header: 'Ticket ID' },
      { field: 'TicketDate', header: 'Ticket Date' },
      { field: 'lastdiffed', header: 'Modified Date' },
      { field: 'Status', header: 'Status' },
      { field: 'location', header: 'Location' },
      { field: 'ComponentName', header: 'Component Name' },
      { field: 'Subject', header: 'Subject' },
      { field: 'Assignee', header: 'Assignee' },
      { field: 'DefaultCC', header: 'DefaultCC' },
      { field: 'URL', header: 'URL' },
      { field: 'reporter', header: 'Reporter' },
      { field: 'REGNNAME', header: 'Region' },
      { field: 'Dname', header: 'District' },
      { field: 'shop_number', header: 'Shop_Number' },
    ];
    this.TDCols = [
      // { field: 'TicketID', header: 'TicketID' },
      // { field: 'reporter', header: 'Reporter' },
      // { field: 'ticketTime', header: 'Comment Date' },
      { field: 'description', header: 'Description' },
    ];
  }

  onSelect(type) {
    let statusSeletion = [];
    switch (type) {
      case 'Status':
        if (this.bugStatusData.length !== 0) {
          this.bugStatusData.forEach(bs => {
            statusSeletion.push({ label: bs.name, value: bs.id });
          });
          this.StatusOptions = statusSeletion;
          this.StatusOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onTicket() {
    const params = {
      'UserId': this.login_User.Id,
      'TicketID': "A"
    }
    this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
      if (res.length !== 0 && res !== undefined && res !== null) {
        this.TicketReportData = res;
        this.onTD();
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'warn',
          summary: 'Warning Message', detail: 'No record found!'
        });
      }
    });
  }

  onTD() {
    const params = {
      'UserId': this.login_User.Id,
      'TicketID': "TD"
    }
    this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
      if (res) {
        this.AllTD = res;
        if (this.AllTD.length !== 0) {
          this.AllTD.forEach(t => {
            this.TicketReportData.forEach(d => {
              if (d.TicketID === t.ticket_id) {
                d.TicketDescription = t.description;
              }
            })
          })
        }
        if (this.TicketID !== undefined) {
          let ATD = [];
          ATD = this.AllTD;
          ATD.forEach(AllTD => {
            if (this.TicketID === AllTD.ticket_id) {
              this.TD.push({ TicketID: AllTD.ticket_id, description: AllTD.description, reporter: AllTD.reporter, ticketTime: AllTD.ticketTime });
            }
          });
        }
      }
    });
  }

  onRowSelect(event) {
    this.onResetTable();
    this.TicketID = event.data.TicketID;
    this.Assignee = event.data.Assignee;
    this.Location = event.data.location;
    this.Region = (event.data.REGNNAME !== null && event.data.REGNNAME !== undefined) ? event.data.REGNNAME : '-';
    this.District = (event.data.Dname !== null && event.data.Dname !== undefined) ? event.data.Dname : '-';
    this.ShopName = event.data.shop_number;
    this.Component = event.data.ComponentName;
    this.DefaultCC = event.data.DefaultCC;
    this.reporter = event.data.reporter;
    this.Subject = event.data.Subject;
    this.URL = event.data.URL;
    this.TicketDescription = event.data.TicketDescription;
    this.ComponentDescription = (event.data.description !== undefined && event.data.description !== null) ? event.data.description : '';
    this.StatusOptions = [{ label: event.data.Status, value: event.data.status_code }];
    this.Status = [{ label: event.data.Status, value: event.data.status_code }];
    this.StatusCode = event.data.status_code;
    this.StatusLabel = event.data.Status;
    this.onTD();
    this.showDialog = true;
    this.dialogHeader = 'Update Ticket' + this.TicketID + ' - Reported By ' + this.reporter
  }

  onUpdate() {
    if (this.TicketID !== undefined) {
      const params = {
        'ticketID': this.TicketID,
        'reporter': this.login_User.RealName,
        'ticketdescription': this.TicketDescription,
        'Status': (this.Status.label !== undefined && this.Status.label !== null) ? this.Status.label : this.StatusLabel,
        'StatusCode': (this.Status.value !== undefined && this.Status.value !== null) ? this.Status.value : this.StatusCode,
      }
      this.restApiService.post(PathConstants.TicketDescription, params).subscribe(res => {
        if (res) {
          this.blockScreen = false;
          this.onTicket();
          this.showDialog = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'success',
            summary: 'Success Message', detail: 'Ticket ID: ' + this.TicketID + ' Updated Successfully !'
          });
          this.CancelTD();
          this.onTD();
        } else {
          this.blockScreen = false;
          this.showDialog = true;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'error',
            summary: 'Error Message', detail: res.item2
          });
        }
      }, (err: HttpErrorResponse) => {
        this.showDialog = true;
        this.blockScreen = false;
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'error',
            summary: 'Error Message', detail: 'Please Contact Administrator!'
          });
        }
      });
    }
  }

  onSave() {
    this.blockScreen = true;
    this.showDialog = false;
    if (this.TicketID !== undefined) {
      const bodyparams = {
        'TicketId': this.TicketID,
        'Location': this.Location,
        'RegionalOffice': this.Region,
        'DistrictOffice': this.District,
        'ShopCode': this.ShopName,
        'Component': this.Component,
        'Asignee': this.Assignee,
        'Status': (this.Status.label !== undefined && this.Status.label !== null) ? this.Status.label : this.StatusLabel,
        'StatusCode': (this.Status.value !== undefined && this.Status.value !== null) ? this.Status.value : this.StatusCode ,
        'ComponentDescription': this.ComponentDescription,
        'TicketDescription': this.TicketDescription,
        'Subject': this.Subject,
        'ToCC': this.DefaultCC + ';' + this.login_User.user,
      }
      const params = {
        'ticket_id': this.TicketID,
        'assingedTo': this.login_User.user,
        'Ticketstatus': (this.Status.label !== undefined && this.Status.label !== null) ? this.Status.label : this.StatusLabel,
        'short_desc': this.Subject,
        'URL': "Tasmac-hms.com",
        'CC': this.DefaultCC,
        'StatusCode': (this.Status.value !== undefined && this.Status.value !== null) ? this.Status.value : this.StatusCode ,
        //mailsending
        'bodyMessage': bodyparams

      }
      this.restApiService.put(PathConstants.UpdateTicket, params).subscribe(res => {
        if (res) {
          this.onUpdate();
          // this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'success',
            summary: 'Success Message', detail: 'Ticket Updated Successfully !'
          });
        } else {
          this.blockScreen = false;
          this.showDialog = true;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'error',
            summary: 'Error Message', detail: res.item2
          });
        }
      }, (err: HttpErrorResponse) => {
        this.blockScreen = false;
        this.showDialog = true;
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'error',
            summary: 'Error Message', detail: 'Please Contact Administrator!'
          });
        }
      });
    }
  }

  ticketUpdate() {
    let ticketSelection = [];
    ticketSelection.forEach(res => {
      ticketSelection.push({
        TicketID: this.TicketID, AssignedTo: this.Assignee, Status: this.Status, Subject: this.Subject,
        Reporter: this.Assignee, URL: this.URL, StatusCode: this.StatusCode
      });
    })
  }

  onResetTable() {
    this.TDData = [];
    this.TD = [];
  }

  onCancel() {
    this.Status = null;
    this.StatusCode = null;
    this.Assignee = null;
    this.TicketID = null;
    this.DefaultCC = null;
    this.Subject = null;
    this.URL = null;
    this.TicketDescription = null;
    this.StatusOptions = [];
  }

  CancelTD() {
    this.TD = [];
    this.TicketDescription = null;
  }
}