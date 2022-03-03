import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Table } from 'primeng/table/table';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { NgForm } from '@angular/forms';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
@Component({
  selector: 'app-incident-details-report',
  templateUrl: './incident-details-report.component.html',
  styleUrls: ['./incident-details-report.component.css']
})
export class IncidentDetailsReportComponent implements OnInit {
  incidentCols: any;
  incidentData = [];
  loading: boolean;
  fromDate: any;
  toDate: any;
  maxDate: Date = new Date();
  items: MenuItem[];
  regionOptions: SelectItem[];
  rcode: string;
  districtOptions: SelectItem[];
  dcode: string;
  regionsData: any = [];
  districtsData: any = [];
  @ViewChild('dt', { static: false }) table: Table;
  @ViewChild('f', { static: false }) fields: NgForm;

  constructor(private messageService: MessageService, private datepipe: DatePipe,
    private restApiService: RestAPIService, private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.items = [
      {
        label: 'Excel', icon: 'pi pi-file-excel', command: () => {
          this.table.exportCSV();
        }
      },
      {
        label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
          // this.exportPdf();
        }
      },
    ];
    this.incidentCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'shopcode', header: 'Shop Number' },
      { field: 'doc_date', header: 'Incident Date' },
      { field: 'reason', header: 'Reason' },
      { field: 'url_path', header: 'URL' },
      { field: 'remarks', header: 'Remarks' }
    ];
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    switch (type) {
      case 'R':
        if (this.regionsData.length !== 0) {
          this.regionsData.forEach(r => {
            regionSelection.push({ label: r.name, value: r.code });
          })
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'D':
        if (this.districtsData.length !== 0) {
          this.districtsData.forEach(d => {
            if (this.rcode === d.rcode) {
              districtSeletion.push({ label: d.name, value: d.code });
            }
          })
          this.districtOptions = districtSeletion;
          this.districtOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onChange(type) {
    this.incidentData = [];
    if (type === 'RM') {
      this.dcode = null;
    } else if (type === 'DA') {
      this.checkValidDateSelection();
    }
    this.onLoadTable();
  }

  onLoadTable() {
    if (this.rcode !== undefined && this.rcode !== null && this.rcode !== '' &&
      this.dcode !== undefined && this.dcode !== null && this.dcode !== '' &&
      this.fromDate !== undefined && this.fromDate !== null && this.fromDate !== ''
      && this.toDate !== undefined && this.toDate !== null && this.toDate !== '') {
      this.loading = true;
      const params = new HttpParams().set('FDate', this.datepipe.transform(this.fromDate, 'yyyy-MM-dd'))
        .append('TDate', this.datepipe.transform(this.toDate, 'yyyy-MM-dd')).append('RCode', this.rcode)
        .append('DCode', this.dcode);
      this.restApiService.getByParameters(PathConstants.IncidentGetURL, params).subscribe((res: any) => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.incidentData = res;
          let sno = 1;
          this.incidentData.forEach(i => { i.SlNo = sno; sno += 1; });
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

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({
          key: 'msgKey', severity: 'error', life: 5000
          , summary: 'Invalid Date!', detail: 'Please select the valid date'
        });
        this.fields.controls.fDate.reset();
        this.fields.controls.tDate.reset();
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetFields(type) {
    if (type === 'RM') {
      this.dcode = null;
    }
  }

  // exportPdf() {
  //   var rows = [];
  //   this.incidentData.forEach(element => {
  //     var temp = [element.SlNo, element.rm_office, element.dm_office,
  //     element.location, element.component, element.shop_number, element.type,
  //     element.from_date, element.to_date, element.reason, element.remarks,
  //     element.url_path];
  //     rows.push(temp);
  //   });
  //   import("jspdf").then(jsPDF => {
  //     import("jspdf-autotable").then(x => {
  //       const doc = new jsPDF.default('l', 'pt', 'a4');
  //       doc.autoTable(this.incidentCols, rows);
  //       doc.save('NMS_REPORT.pdf');
  //     })
  //   })
  // }

}
