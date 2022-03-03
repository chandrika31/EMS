import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { LocationStrategy, DatePipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import * as Chart from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Rx';
import 'rxjs/observable/from';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  chartJs = Chart;
  chartLabelPlugin = ChartDataLabels;
  blockScreen: boolean;
  nmsBarData: any;
  slaBarData: any;
  pieData: any;
  nmsBarOptions: any;
  NMSLabels: any = [];
  SLALabels: any = [];
  slaBarOptions: any;
  pieOptions: any;
  chart: ChartModule;
  pieChartOptions: any;
  pieChartLabels: string[];
  pieChartColor: any;
  pieChartData: any[];
  plugin: any;
  incidentLineData: any;
  incidentLineOptions: any;
  slaTypeOptions: SelectItem[];
  nmsTypeOptions: SelectItem[];
  slaType: number = 5 ;
  nmsType: string = 'DM';
  districts: any = [];
  regions: any = [];
  components: any[] = [];
  nmsBarType: string;
  shops: any = [];
  total_shops: any = [];
  pieLabels: string[] = [];
  bug_count: any = [];
  incidents: any = [];
  months: any[];
  maxLimitOfIncident: number;
  stepSizeOfIncident: number;
  roleId: any;
  userInfo: any;
  bugStatusData: any = [];
  camera_count: any = [];
  CameraLabels: string[] = [];
  cameraBarData: any;
  cameraBarOptions: any;
  region_wise_shops: any = [];
  SLATicketData: any = [];

  constructor(private restApi: RestAPIService, private locationStrategy: LocationStrategy,
    private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.preventBackButton();
    this.userInfo = this.authService.getLoggedUser();
    this.roleId = this.userInfo.RoleId;
    this.months = [{ name: "August", value: 8 }, { name: "September", value: 9 },
    { name: "October", value: 10 }, { name: "November", value: 11 },
    { name: "December", value: 12 }, { name: "January", value: 1 },
    { name: "February", value: 2 }, { name: "March", value: 3 },
    { name: "April", value: 4 }, { name: "May", value: 5 }, { name: "June", value: 6 },
    { name: "July", value: 7 }];
    this.slaTypeOptions = [
      { label: 'Retail Shop', value: 5 },
      { label: 'District wise', value: 4 },
      { label: 'Regional wise', value: 3 },
      { label: 'Total', value: 2 }
    ];
    this.nmsTypeOptions = [
      { label: 'District wise', value: 'DM' },
      { label: 'Regional wise', value: 'RM' },
      { label: 'Total', value: 'HO' }
    ];
    //Pie chart
    this.restApi.get(PathConstants.BugStatus).subscribe(bugstatus => {
      bugstatus.forEach(bs => {
        this.bugStatusData.push({ 'name': bs.value, 'id': bs.id });
      });
      this.onLoadHMSChart();
    });
    this.restApi.get(PathConstants.RegionMasterURL).subscribe(reg => {
      reg.forEach(r => {
        this.regions.push({ 'name': r.REGNNAME, 'code': r.REGNCODE });
      })
      //NMS Bar chart
      this.onNMSTypeChange(this.nmsType);
    })

    this.restApi.get(PathConstants.DistrictMasterURL).subscribe(dist => {
      dist.forEach(d => {
        this.districts.push({ 'name': d.Dname, 'code': d.Dcode });
      })
      //NMS Bar chart
      this.onNMSTypeChange(this.nmsType);
    })
    this.restApi.get(PathConstants.ComponentsURL).subscribe((comp: any) => {
      comp.forEach(c => {
        this.components.push({ name: c.name, product_id: c.product_id, comp_id: c.id });
      });
      this.restApi.getByParameters(PathConstants.ShopsGetURL, { 'type': 1 }).subscribe(shop => {
        /// total shop count
        shop.Table1.forEach(t => {
          this.total_shops.push({ 'count': t.shopcount, 'status': t.installation_status });
        })
        ///region wise shop count
        shop.Table2.forEach(r => {
          this.region_wise_shops.push({ 'count': r.shopcount, 'status': r.installation_status, 'rcode': r.rcode  })
        })
        /// district wise shop count
        shop.Table.forEach(s => {
          this.shops.push({ 'count': s.shopcount, 'status': s.installation_status, 'dcode': s.dcode });
          //NMS Bar chart
          this.onNMSTypeChange(this.nmsType);
        })
      })
      //SLA Bar chart
      // this.onSLATypeChange(this.slaType);
    });
    this.restApi.get(PathConstants.SLATicketCountGet).subscribe(res => {
      this.SLATicketData = res;
      this.onSLATypeChange(this.slaType);
    });
    this.restApi.get(PathConstants.CameraCountGet).subscribe(total => {
      total.forEach(t => {
        this.camera_count.push({ 'count': t.count, 'status': t.isActive, 'dcode': t.DCode });
      })
      this.onLoadCameraStatus();
    })
    //Line Chart
    this.restApi.getByParameters(PathConstants.MonthwiseIncidentGetURL, { 'type': 1 }).subscribe(res => {
      var data = [];
      res.Table.forEach(x => { data.push(x); });
      res.Table1.forEach(x => { data.push(x) });
      res.Table2.forEach(x => { data.push(x) });
      var groupedData;
      Observable.from(data)
      .groupBy(x => x.month_no) // using groupBy from Rxjs
      .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
      .map(g => {// mapping 
        return {
          month_no: g[0].month_no,//take the first name because we grouped them by name
          count: _.sumBy(g, 'count'), // using lodash to sum price
        }
      })
      .toArray() //.toArray because I guess you want to loop on it with ngFor      
      .do(sum => console.log('sum:', sum)) // just for debug
      .subscribe(d => groupedData = d); 
      for (let i = 0; i < this.months.length; i++) {
        for (let j = 0; j < groupedData.length; j++) {
          if (this.months[i].value === groupedData[j].month_no) {
            this.incidents.splice(i, 0, groupedData[j].count);
            this.months[i]['index'] = i; //adding index in months array for navigation
            break;
          } else {
            this.incidents.splice(i, 0, 0);
          }
        }
      }
      this.maxLimitOfIncident = this.incidents.reduce((a, b) => Math.max(a, b));
      this.stepSizeOfIncident = (this.maxLimitOfIncident.toString().length === 1) ? 1 :
        ((this.maxLimitOfIncident.toString().length === 2) ? 10 : 100);
      this.onLoadIncidentChart();
    })
  }

  onLoadHMSChart() {
    this.bugStatusData.forEach(b => {
      if (b.id === 7 || b.id === 6 || b.id === 5 || b.id === 2)
        this.pieLabels.push(b.name);
    })
    let filteredArr = [];
    this.restApi.getByParameters(PathConstants.HMSReportURL, { 'value': 1 }).subscribe(res => {
      res.forEach(x => {
        if (x.status_code === 8) {
          x.bug_status = 'OPEN';
        } else if (x.status_code === 4) {
          x.bug_status = 'COMPLETED';
        }
      })
      if (this.roleId === 1 || this.roleId === 2) {
        filteredArr = res;
      } else if (this.roleId === 3) {
        filteredArr = res.filter(f => {
          return f.product_id === 3 || f.product_id === 4 || f.product_id === 5
        })
      } else if (this.roleId === 4) {
        filteredArr = res.filter(f => {
          return f.product_id === 4 || f.product_id === 5
        })
      }
      for (let i = 0; i < this.pieLabels.length; i++) {
        let count = 0
        filteredArr.forEach(c => {
          if (this.pieLabels[i].toLowerCase() === c.bug_status.toLowerCase()) {
            count += c.bug_count
          }
        })
        this.bug_count.push(count);
      }
      this.pieData = {
        labels: this.pieLabels,
        datasets: [
          {
            label: "Percentage",
            data: this.bug_count,
            backgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ],
            hoverBackgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ]
          }]
      };
    })
    //Pie chart show data inside each slices
    // this.chartJs.plugins.unregister(this.chartLabelPlugin);
    this.plugin = ChartDataLabels;
    this.pieOptions = {
      plugins: {
        datalabels: {
          /* show value in percents */
          formatter: (value, ctx) => {
            let sum = 0;
            const dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
              sum += data;
            });
            const percentage = (value * 100 / sum);
            const calculatedPercent = percentage !== 0 ? percentage.toFixed(0) + '%' : '';
            return calculatedPercent;
          },
          color: '#fff',
          fontSize: 18
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  }

  onLoadIncidentChart() {
    const year = new Date().getFullYear();
    var labels = [];
    this.months.forEach(m => { labels.push(m.name) });
    this.incidentLineData = {
      labels: labels,
      datasets: [
        {
          label: 'Months ( From Year' + ' ' + year + ' - ' + (year + 1) + ' )',
          data: this.incidents,
          fill: false,
          borderColor: '#4bc0c0',
          lineTension: 0.08,
        }
      ],
    }
    this.incidentLineOptions = {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: this.maxLimitOfIncident,
            stepSize: this.stepSizeOfIncident
          }
        }]
      },
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          backgroundColor: '4bc0c0',
          color: 'black',
          boredrRadius: 4,
          font: {
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };
  }

  onSLATypeChange(value) {
    this.slaBarOptions = {
      scales: {
        xAxes: [{
          barPercentage: 0.21
        }],
        yAxes: [{
          ticks: {
            min: 10,
            max: 100,
            stepSize: 10,
            callback: function (value, index, values) {
              return value + '%';
            }
          }
        }]
      },
      title: {
        display: true,
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      },
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          borderRadius: 4,
          color: 'black',
          font: {
            weight: 'normal'
          }
        }
      }
    };
    this.SLALabels = [];
      var dataset = [];
      let tempArr = this.SLATicketData.filter(y => {
        return y.product_id === value;
      });
      var labels = this.components.filter(x => {
        return x.product_id === value;
      });
      labels.forEach(i => {
        this.SLALabels.push(i.name);
        tempArr.forEach(j => {
          if(i.comp_id === j.component_id) {
            dataset.push(j.count * 10);
          }
        })
      });
      for(let i = 0; i < labels.length; i ++) {
        if(dataset.length <= labels.length) {
          dataset.push(100);
        }
      }
      this.slaBarData = {
        labels: this.SLALabels,
        datasets: [
          {
            label: 'Time(in percentage)',
            backgroundColor: ['#1ebf1b', '#f0dd13', '#ff6993','#fc9b2b', '#09c4d9'],
            data: dataset
          }
        ]
      }
  }

  onNMSTypeChange(value) {
    if (value === 'DM') {
      var labels = [];
      this.districts.forEach(d => {
        labels.push(d.name);
      })
      this.NMSLabels = labels;
      this.nmsBarType = 'bar';
      var dataset1 = [];
      var dataset2 = [];
      var total_running_count = 0;
      var total_not_running_count = 0;
      this.shops.forEach(s => {
        if (s.status) {
          dataset1.push(s.count);
          total_running_count += s.count;
        } else {
          this.districts.forEach(d => {
            if (d.code === s.dcode) {
              dataset2.push(s.count);
              total_not_running_count += s.count;
            } else {
              dataset2.push(null);
            }
          })
        }
      })
      this.nmsBarData = {
        labels: this.NMSLabels,
        datasets: [
          {
            label: "Total Running (in No's) - " + total_running_count,
            data: dataset1,
            backgroundColor: '#52c91e',
          },
          {
            label: "Total Not Running (in No's) - " + total_not_running_count,
            data: dataset2,
            backgroundColor: '#fc2121',
          }
        ]
      }
      this.nmsBarOptions = {
        scales: {
          xAxes: [{
            barPercentage: 0.80,
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        },
        title: {
          display: true,
          fontSize: 16
        },
        legend: {
          position: 'bottom'
        },
        plugins: {
          datalabels: {
            /* show value inside stacked bar */
            formatter: (value, ctx) => {
              let sum = 0;
              for (let i = 0; i <= ctx.chart.data.datasets.length; i++) {
                const dataArr = ctx.chart.data.datasets[i].data;
                dataArr.map(data => {
                  sum += data;
                });
                var data = (value !== 0) ? value : '';
                return data;
              }
            },
            color: "#000000",
            fontSize: 14
          }
        }
      };
    } else if (value === 'RM') {
      var labels = [];
      this.regions.forEach(d => {
        labels.push(d.name);
      })
      this.NMSLabels = labels;
      this.nmsBarType = 'bar';
      var dataset1 = [];
      var dataset2 = [];
      var total_running_count = 0;
      var total_not_running_count = 0;
      this.region_wise_shops.forEach(s => {
        if (s.status) {
          dataset1.push(s.count);
          total_running_count += s.count;
        } else {
          this.regions.forEach(d => {
            if (d.code === s.dcode) {
              dataset2.push(s.count);
              total_not_running_count += s.count;
            } else {
              dataset2.push(null);
            }
          })
        }
      })
      this.nmsBarData = {
        labels: this.NMSLabels,
        datasets: [
          {
            label: "Total Running (in No's) - " + total_running_count,
            data: dataset1,
            backgroundColor: '#52c91e',
          },
          {
            label: " Total Not Running (in No's) - " + total_not_running_count,
            data: dataset2,
            backgroundColor: '#fc2121',
          }
        ]
      }

      this.nmsBarOptions = {
        scales: {
          xAxes: [{
            barPercentage: 0.15,
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        },
        title: {
          display: true,
          fontSize: 16
        },
        legend: {
          position: 'bottom'
        },
        plugins: {
          datalabels: {
            /* show value inside stacked bar */
            formatter: (value, ctx) => {
              let sum = 0;
              for (let i = 0; i <= ctx.chart.data.datasets.length; i++) {
                const dataArr = ctx.chart.data.datasets[i].data;
                dataArr.map(data => {
                  sum += data;
                });
                var data = (value !== 0) ? value : '';
                return data;
              }
            },
            color: "#000000",
            fontSize: 14
          }
        }
      };
    } else {
      this.NMSLabels = ['Shops'];
      this.nmsBarType = 'horizontalBar';
      var dataset1 = [];
      var dataset2 = [];
      var installed = null;
      var not_installed = null;
      this.total_shops.forEach(t => {
        if (t.status) {
          installed = t.count;
        } else {
          not_installed = t.count;
        }
      })
      dataset1.push(installed);
      dataset2.push(not_installed);
      // dataset.push(t.count);
      this.nmsBarData = {
        labels: this.NMSLabels,
        datasets: [
          {
            label: "Running (in No's)",
            data: dataset1,
            backgroundColor: '#52c91e',
          },
          {
            label: "Not Running (in No's)",
            data: dataset2,
            backgroundColor: '#fc2121',
          }
        ]
      }
      this.nmsBarOptions = {
        scales: {
          yAxes: [{
            stacked: true,
            barPercentage: 0.12
          }],
          xAxes: [{
            stacked: true,
            ticks: {
              min: 0,
              max: 3200,
              stepSize: 200
            }
          }]
        },
        title: {
          display: true,
          fontSize: 16
        },
        legend: {
          position: 'bottom'
        }
      };
    }
  }

  onLoadCameraStatus() {
    var labels = [];
    this.districts.forEach(d => {
      labels.push(d.name);
    })
    this.CameraLabels = labels;
    var dataset1 = [];
    var dataset2 = [];
    var total_running_count = 0;
    var total_not_running_count = 0;
    for (let i = 0; i < this.districts.length; i++) {
      for (let j = 0; j < this.camera_count.length; j++) {
        if (this.camera_count[j].status === 1) {
          if (this.camera_count[j].dcode === this.districts[i].code) {
            dataset1[i] = this.camera_count[j].count;
            total_running_count += this.camera_count[j].count;
            break;
          } else {
            dataset1[i] = null;
          }
        } else {
          if (this.camera_count[j].dcode === this.districts[i].code) {
            dataset2[i] = this.camera_count[j].count;
            total_not_running_count += this.camera_count[j].count;
            // break;
          } else {
            dataset2[i] = null;
          }
        }
      }
    }
    this.cameraBarData = {
      labels: this.CameraLabels,
      datasets: [
        {
          label: "Total Running (in No's) - " + total_running_count,
          data: dataset1,
          backgroundColor: '#52c91e',
        },
        {
          label: "Total Not Running (in No's) - " + total_not_running_count,
          data: dataset2,
          backgroundColor: '#fc2121',
        }
      ]
    }
    this.cameraBarOptions = {
      scales: {
        xAxes: [{
          barPercentage: 0.80,
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      },
      title: {
        display: true,
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      },
      plugins: {
        datalabels: {
          /* show value inside stacked bar */
          formatter: (value, ctx) => {
            let sum = 0;
            for (let i = 0; i <= ctx.chart.data.datasets.length; i++) {
              const dataArr = ctx.chart.data.datasets[i].data;
              dataArr.map(data => {
                sum += data;
              });
              var data = (value !== 0) ? value : '';
              return data;
            }
          },
          color: "#000000",
          fontSize: 14
        }
      }
    };
  }

  selectData(event, type) {
    const index: string = event.element._index;
    if (type === 'P') {
      this.router.navigate(['bugzilla'], { queryParams: { id: index, si: true } });
    } else if (type === 'L') {
      let month;
      this.months.forEach(m => {
        if (m.index === index && m.index !== undefined) {
          month = m.value;
          this.router.navigate(['all-incident-report'], { queryParams: { id: month, si: true } });
        }
      })
    }
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }
}

