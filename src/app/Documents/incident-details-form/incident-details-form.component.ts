import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { DatePipe } from '@angular/common';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { NgForm } from '@angular/forms';
import { element } from 'protractor';

@Component({
  selector: 'app-incident-details-form',
  templateUrl: './incident-details-form.component.html',
  styleUrls: ['./incident-details-form.component.css']
})
export class IncidentDetailsFormComponent implements OnInit {
  blockScreen: boolean;
  districtsData: any = [];
  shopData: any = [];
  regionsData: any = [];
  reasonData: any = [];
  reasonOptions: SelectItem[];
  rcode: any;
  regionOptions: SelectItem[];
  districtOptions: SelectItem[];
  dcode: any;
  shopOptions: SelectItem[];
  shopCode: any;
  reason: any;
  urlPath: string;
  date: any;
  remarksTxt: string;
  maxDate: Date = new Date();

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.shopData = this.masterDataService.getShops();
    this.reasonData = this.masterDataService.getReasons();
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    let shopSeletion = [];
    let reasonSeletion = [];
    switch (type) {
      case 'RM':
        if (this.regionsData.length !== 0) {
          this.regionsData.forEach(r => {
            regionSelection.push({ label: r.name, value: r.code });
          })
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'DM':
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
      case 'SH':
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
            if (r.type === 2) {
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
    } else if (field === 'DM') {
      this.shopCode = null;
    }
  }

  onFileUpload(event) {
    console.log('eve', event);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        console.log('url', event.target.result);
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSave(form: NgForm) {
    this.blockScreen = true;
    const params = {
      'RCode': (this.rcode !== undefined && this.rcode !== null) ? this.rcode : '-',
      'DCode': (this.dcode !== undefined && this.dcode !== null) ? this.dcode : '-',
      'ShopCode': (this.shopCode !== undefined && this.shopCode !== null) ? this.shopCode.label : '-',
      'DocDate': this.datepipe.transform(this.date, 'yyyy-MM-dd h:mm:ss a'),
      'Reason': this.reason,
      'URL': this.urlPath,
      'Remarks': (this.remarksTxt !== null && this.remarksTxt.trim() !== '') ? this.remarksTxt.trim() : '-'
    }
    this.restApiService.post(PathConstants.IncidentPostURL, params).subscribe(res => {
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
