import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-shop-live-details',
  templateUrl: './shop-live-details.component.html',
  styleUrls: ['./shop-live-details.component.css']
})
export class ShopLiveDetailsComponent implements OnInit {
  selectedType: any;
  hours: number;
  maxDate: Date = new Date();
  startDate: any;
  endDate: any;
  regionsData: any = [];
  districtsData: any = [];
  shopData: any = [];
  shopOptions: SelectItem[];
  shopNo: any;
  regionOptions: SelectItem[];
  rcode: any;
  districtOptions: SelectItem[];
  dcode: any;
  remarks: string;
  user: any;
  blockScreen: boolean;
  Camera_Id: any;
  selectedDcode: any;
  allDistrictOptions: SelectItem[];
  cameraLiveDetailsData: any = [];
  loading: boolean;
  disableRM: boolean;
  disableSH: boolean;
  cameraLiveDetailsCols: any[];
  showDialog: boolean;
  btn_label: string;
  @ViewChild('dt', { static: false }) table: Table;
  disableDM: boolean;
  isEdited: any;

  constructor(private authService: AuthService, private masterDataService: MasterDataService,
    private datepipe: DatePipe, private restApiService: RestAPIService, private messageService: MessageService) { }

  ngOnInit() {
    this.user = this.authService.getLoggedUser().user;
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.shopData = this.masterDataService.getShops();
    this.btn_label = 'Save';
    this.cameraLiveDetailsCols = [
      { header: 'Region Name', field: 'REGNNAME' },
      { header: 'District Name', field: 'Dname' },
      { header: 'Shop Number', field: 'ShopNo' },
      { header: 'Start Date', field: 'StartDate' },
      { header: 'End Date', field: 'EndDate' },
      { header: 'isActive', field: 'isActive' },
      { header: 'Hours', field: 'Hours' },
      { header: 'Created Date', field: 'CreatedDate' },
    ];
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    let shopSeletion = [];
    let allDistrictSeletion = [];
    switch (type) {
      case 'RM':
        if (this.regionsData.length !== 0) {
          if (this.user.RoleId === 3 || this.user.RoleId === 4) {
            this.regionsData.forEach(r => {
              if (r.code === this.user.RCode) {
                regionSelection.push({ label: r.name, value: r.code, address: r.address });
              }
            })
          } else {
            this.regionsData.forEach(r => {
              regionSelection.push({ label: r.name, value: r.code, address: r.address });
            })
          }
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'DM':
        if (this.districtsData.length !== 0) {
          this.districtsData.forEach(d => {
            if (this.rcode.value === d.rcode) {
              districtSeletion.push({ label: d.name, value: d.code, address: d.address });
            }
          })
          this.districtOptions = districtSeletion;
          this.districtOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'AD':
        if (this.districtsData.length !== 0) {
          this.districtsData.forEach(d => {
            allDistrictSeletion.push({ label: d.name, value: d.code, address: d.address });
          })
          this.allDistrictOptions = allDistrictSeletion;
          this.allDistrictOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'SH':
        if (this.shopData.length !== 0) {
          this.shopData.forEach(s => {
            if (this.dcode.value === s.dcode) {
              shopSeletion.push({ label: s.shop_num, value: s.shop_num, address: s.address });
            }
          })
          this.shopOptions = shopSeletion;
          this.shopOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onResetFields(field) {
    if (field === 'RM') {
      this.dcode = null;
    } else if (field === 'DM') {
      this.shopNo = null;
    }
  }

  onSave(form: NgForm) {
    this.blockScreen = true;
    const params = {
      'Id': (this.Camera_Id !== null && this.Camera_Id !== undefined) ? this.Camera_Id : 0,
      'DCode': (this.dcode !== undefined && this.dcode !== null) ? this.dcode.value : null,
      'RCode': (this.rcode !== undefined && this.rcode !== null) ? this.rcode.value : null,
      'StartDate': (this.isEdited) ? this.startDate : this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
      'Remarks': this.remarks,
      'ShopNo': (this.shopNo !== undefined && this.shopNo !== null) ? this.shopNo.value : null,
      'EndDate': (this.isEdited) ? this.endDate : this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
      'Hours': this.hours,
      'isActive': (this.selectedType * 1),
      'User': this.user,
    }
    this.restApiService.post(PathConstants.CameraLiveDetailsPost, params).subscribe(res => {
      if (res.item1) {
        this.onClear(form);
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'success',
          summary: 'Success Message', detail: (this.isEdited) ? 'Updated Successfully!' : 'Saved Successfully!'
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please contact administrator !'
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

  resetFormFields(form) {
    form.controls.shop_no.reset();
    form.controls.rname.reset();
    form.controls.dname.reset();
    form.controls.s_date.reset();
    form.controls.e_date.reset();
    form.controls.hrs.reset();
    form.controls.cam_status.reset();
    form.controls.remarks_text.reset();
  }

  onView() {
    this.showDialog = true;
    this.loading = false;
    this.isEdited = false;
    this.table.reset();
  }

  getCameraStatusDetails() {
    this.loading = true;
    if (this.selectedDcode !== null && this.selectedDcode !== undefined) {
      this.table.reset();
      this.cameraLiveDetailsData.length = 0;
      const params = {
        'DCode': this.selectedDcode.value
      }
      this.restApiService.getByParameters(PathConstants.CameraLiveDetailsGet, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.cameraLiveDetailsData = res;
          this.loading = false;
        } else {
          this.loading = false;
          this.messageService.add({
            key: 'd-err', severity: 'warn',
            summary: 'Warning Message', detail: 'No data found for selected date!'
          });
        }
      }, (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 'd-err', severity: 'error',
            summary: 'Error Message', detail: 'Please Contact Administrator!'
          });
        }
      });
    }
  }


  onRowSelect(row, index, form: NgForm) {
    if (row !== undefined && row !== null) {
      this.showDialog = false;
      this.isEdited = true;
      this.resetFormFields(form);
      this.btn_label = 'Update';
      this.disableRM = true;
      this.disableDM = true;
      this.disableSH = true;
      this.Camera_Id = row.Id;
      this.remarks = row.Remarks;
      this.startDate = this.datepipe.transform(row.StartDate, 'yyyy-MM-dd');
      this.endDate = this.datepipe.transform(row.EndDate, 'yyyy-MM-dd');
      this.hours = row.Hours;
      this.selectedType = row.isActive;
      this.regionOptions = [{ label: row.REGNNAME, value: row.RCode }];
      this.rcode = { label: row.REGNNAME, value: row.RCode };
      this.districtOptions = [{ label: row.Dname, value: row.DCode }];
      this.dcode = { label: row.Dname, value: row.DCode };
      this.shopOptions = [{ label: row.ShopNo, value: row.ShopNo }];
      this.shopNo = { label: row.ShopNo, value: row.ShopNo };
    }
  }

  onClear(form: NgForm) {
    form.reset();
    form.form.markAsUntouched();
    form.form.markAsPristine();
    this.resetFormFields(form);
    this.btn_label = 'Save';
    this.disableDM = false;
    this.disableRM = false;
    this.disableSH = false;
    this.blockScreen = false;
    this.loading = false;
    this.showDialog = false;
    this.regionOptions = null;
    this.rcode = null;
    this.districtOptions = null;
    this.dcode = null;
    this.shopOptions = null;
    this.shopNo = null;
    this.isEdited = false;
  }
}

