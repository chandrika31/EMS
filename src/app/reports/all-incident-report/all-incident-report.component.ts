import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-incident-report',
  templateUrl: './all-incident-report.component.html',
  styleUrls: ['./all-incident-report.component.css']
})
export class AllIncidentReportComponent implements OnInit {
  incidentCols: any;
  incidentData = [];
  loading: boolean;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private messageService: MessageService, private datepipe: DatePipe,
    private restApiService: RestAPIService, private route: ActivatedRoute) { }

  ngOnInit() {
    let index: any = this.route.snapshot.queryParamMap.get('id');
    this.incidentCols = [
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'Shopcode', header: 'Shop Number' },
      { field: 'DocDate', header: 'Incident Date' },
      { field: 'StatusName', header: 'Status' },
      { field: 'LocName', header: 'Location' },
      { field: 'Address', header: 'Address'},
      { field: 'IssueTypeName', header: 'Issue Type' },
      { field: 'Remarks', header: 'Reason' },
      { field: 'VideoURL', header: 'Video URL' },
      { field: 'ImageURL', header: 'Image URL' },
      { field: 'CreatedDate', header: 'Created Date' },
      { field: 'CompletedDate', header: 'Completed Date' }
    ];
    this.loading = true;
    index = (index * 1);
    this.onLoadTable(index);
  }

  onLoadTable(month) {
    this.loading = true;
    let tempArr = [];
    this.restApiService.getByParameters(PathConstants.IncidentGetURL, { 'type': 1 }).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.Table.forEach(x => { tempArr.push(x) });
        res.Table1.forEach(x => { tempArr.push(x) });
        res.Table2.forEach(x => { tempArr.push(x) });
        this.incidentData = tempArr.filter(f => {
          return f.month === month;
        })
        this.loading = false;
      } else {
        this.loading = false;
        this.table.reset();
        this.messageService.clear();
        this.messageService.add({
          key: 'msgKey', severity: 'warn',
          summary: 'Warning Message', detail: 'No record found!'
        });
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      this.table.reset();
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 'msgKey', severity: 'error',
          summary: 'Error Message', detail: 'Please contact administrator!'
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'msgKey', severity: 'error',
          summary: 'Error Message', detail: 'Please check your network connection!'
        });
      }
    });
  }
}

