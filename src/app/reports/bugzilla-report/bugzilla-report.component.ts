import { Component, OnInit, ViewChild } from '@angular/core';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { Table } from 'primeng/table/table';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
// declare var jsPDF: any;


@Component({
  selector: 'app-bugzilla-report',
  templateUrl: './bugzilla-report.component.html',
  styleUrls: ['./bugzilla-report.component.css']
})
export class BugzillaReportComponent implements OnInit {
  bugzillaCols: any;
  bugzillaData: any = [];
  loading: boolean;
  items: MenuItem[];
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApi: RestAPIService, private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit() {
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
    const index = this.route.snapshot.queryParamMap.get('id');
    this.bugzillaCols = [
      { field: 'ticket_id', header: 'Ticket ID' },
      { field: 'assigned_to', header: 'Assigned To' },
      { field: 'ticket_status', header: 'Ticket Status' },
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'pname', header: 'Product' },
      { field: 'cname', header: 'Component' },
      { field: 'short_desc', header: 'Description' },
      { field: 'creation_ts', header: 'Created Date' }
    ];
    this.loading = true;
    this.restApi.get(PathConstants.HMSReportURL).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        this.bugzillaData = data;
        if (index !== undefined && index !== null) {
          var data = this.bugzillaData.filter(y => {
            return (index === '3' && (y.status_code === 8 || y.status_code === 2))
              || (index === '2' && y.status_code === 5)
              || (index === '1' && y.status_code === 6)
              || (index === '0' && (y.status_code === 7 || y.status_code === 4))
          })
          this.bugzillaData = data;
          console.log('data', data);
        }
        this.loading = false;
      } else {
        this.loading = false;
        this.table.reset();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'No record found!'
        });
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      this.table.reset();
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please contact administrator!'
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

  // exportPdf() {
  //   var rows = [];
  //   this.bugzillaData.forEach(element => {
  //     var temp = [element.SlNo, element.bug_id, element.bug_severity,
  //     element.bug_status, element.assigned_to, element.short_desc,
  //     element.creation_ts];
  //     rows.push(temp);
  //   });
  //   import("jspdf").then(jsPDF => {
  //     import("jspdf-autotable").then(x => {
  //       const doc = new jsPDF.default('l', 'pt', 'a4');
  //       doc.autoTable(this.bugzillaCols, rows);
  //       doc.save('HELPDESK_STATUS_REPORT.pdf');
  //     })
  //   })
  // }
}
