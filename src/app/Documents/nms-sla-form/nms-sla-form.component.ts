import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from '../../Helper/PathConstants';
import { MasterDataService } from '../../masters-services/master-data.service';
import { RestAPIService } from '../../services/restAPI.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-nms-sla-form',
  templateUrl: './nms-sla-form.component.html',
  styleUrls: ['./nms-sla-form.component.css']
})
export class NMSSLAFormComponent implements OnInit {
  shopOptions: SelectItem[];
  shopCode: any;
  regionOptions: SelectItem[];
  rcode: string;
  districtOptions: SelectItem[];
  dcode: string;
  locationOptions: SelectItem[];
  location: number;
  componentOptions: SelectItem[];
  compId: string;
  reasonOptions: SelectItem[];
  reasonId: number;
  bug_id: number;
  closed_date: string;
  remarksTxt: string;
  selectedType: any = 1;
  maxDate: Date = new Date();
  fromDate: any;
  toDate: any;
  reasonData: any = [];
  regionsData: any = [];
  componentsData: any = [];
  districtsData: any = [];
  locationsData: any = [];
  shopData: any = [];
  showCloseDate: boolean;
  isLocationSelected: boolean;
  disableShop: boolean;
  disableDM: boolean;
  disableRM: boolean;
  blockScreen: boolean;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.showCloseDate = false;
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.locationsData = this.masterDataService.getProducts();
    this.shopData = this.masterDataService.getShops();
    this.reasonData = this.masterDataService.getReasons();
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    let locationSeletion = [];
    let shopSeletion = [];
    let reasonSeletion = [];
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
      case 'L':
        if (this.locationsData.length !== 0) {
          this.locationsData.forEach(d => {
            locationSeletion.push({ label: d.name, value: d.id });
          })
          this.locationOptions = locationSeletion;
          this.locationOptions.unshift({ label: '-select-', value: null });
          if (this.location === 2) {
            this.disableDM = this.disableRM = this.disableShop = true;
          } else if (this.location === 5) {
            this.disableDM = this.disableRM = this.disableShop = false;
          } else if (this.location === 4) {
            this.disableDM = this.disableRM = false;
            this.disableShop = true;
          } else if (this.location === 3) {
            this.disableDM = this.disableShop = true;
            this.disableRM = false;
          }
        }
        break;
      case 'C':
        this.componentsData = [];
        this.restApiService.get(PathConstants.ComponentsURL).subscribe((res: any) => {
          res.forEach(x => {
            if (this.location === 3 && x.product_id === 3) {
              this.componentsData.push({ 'label': x.name, 'value': x.id });
              this.disableShop = true;
            } else if (this.location === 4 && x.product_id === 4) {
              this.componentsData.push({ 'label': x.name, 'value': x.id });
            } else if (this.location === 5 && x.product_id === 5) {
              this.componentsData.push({ 'label': x.name, 'value': x.id });
            } else if (this.location === 2 && x.product_id === 5) {
              this.componentsData.push({ 'label': x.name, 'value': x.id });
            }
          });
          this.componentOptions = this.componentsData;
          this.componentOptions.unshift({ label: '-select-', value: null });
        })
        break;
      case 'S':
        if (this.shopData.length !== 0) {
          this.shopData.forEach(s => {
            if (this.dcode === s.dcode) {
              shopSeletion.push({ label: s.shop_num, value: s.dcode });
            }
          })
          this.shopOptions = shopSeletion;
          this.shopOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'RE':
        if (this.reasonData.length !== 0) {
          this.reasonData.forEach(r => {
            if (r.type === 1) {
              reasonSeletion.push({ label: r.name, value: r.id });
            }
          })
          this.reasonOptions = reasonSeletion;
          this.reasonOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onResetFields(field) {
    if (field === 'RM') {
      this.dcode = null;
      this.shopCode = null;
    } else if (field === 'L') {
      this.compId = null;
      this.dcode = null;
      this.rcode = null;
      this.shopCode = null;
    }
  }

  onSave(form: NgForm) {
    this.blockScreen = true;
    const params = {
      'RCode': (this.rcode !== undefined && this.rcode !== null) ? this.rcode : '-',
      'DCode': (this.dcode !== undefined && this.dcode !== null) ? this.dcode : '-',
      'Location': this.location,
      'Component': this.compId,
      'BugId': 0,
      'ClosedDate': (this.showCloseDate) ? this.closed_date : '-',
      'SLAType': this.selectedType,
      'ShopNumber': (this.shopCode !== undefined && this.shopCode !== null) ? this.shopCode.label : '-',
      'FromDate': this.datepipe.transform(this.fromDate, 'yyyy-MM-dd h:mm:ss a'),
      'ToDate': this.datepipe.transform(this.toDate, 'yyyy-MM-dd h:mm:ss a'),
      'Remarks': (this.remarksTxt !== null && this.remarksTxt.trim() !== '') ? this.remarksTxt.trim() : '-',
      'Reason': (this.reasonId !== undefined && this.reasonId !== null) ? this.reasonId : ''
    }
    this.restApiService.post(PathConstants.NMSPostURL, params).subscribe(res => {
      if (res.item1) {
        this.blockScreen = false;
        form.reset();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'success',
          summary: 'Success Message', detail: 'Saved Successfully !'
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: res.item2
        });
      }
    }, (err: HttpErrorResponse) => {
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
