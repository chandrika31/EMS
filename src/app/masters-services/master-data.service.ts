import { Injectable } from '@angular/core';
import { PathConstants } from '../Helper/PathConstants';
import { RestAPIService } from '../services/restAPI.service';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  regions?: any;
  districts?: any;
  products?: any;
  shops?: any;
  reasons?: any;
  bugStatus?: any;
  cc?: any;

  constructor(private restApiService: RestAPIService) { }

  getRegions() {
    this.regions = [];
    this.restApiService.get(PathConstants.RegionMasterURL).subscribe(reg => {
      reg.forEach(r => {
        this.regions.push({ 'name': r.REGNNAME, 'code': r.REGNCODE });
      })
    })
    return this.regions;
  }

  getDistricts() {
    this.districts = [];
    this.restApiService.get(PathConstants.DistrictMasterURL).subscribe(dist => {
      dist.forEach(d => {
        this.districts.push({ 'name': d.Dname, 'code': d.Dcode, 'rcode': d.Rcode });
      })
    })
    return this.districts;
  }

  getProducts() {
    this.products = [];
    this.restApiService.get(PathConstants.ProductsGetURL).subscribe(product => {
      product.forEach(p => {
        this.products.push({ 'name': p.name, 'id': p.id });
      })
    })
    return this.products;
  }

  getShops() {
    this.shops = [];
    this.restApiService.getByParameters(PathConstants.ShopsGetURL, { 'type': 2 }).subscribe(shop => {
      shop.forEach(s => {
        this.shops.push({ 'shop_num': s.SHOPNO, 'dcode': s.Dcode });
      })
    })
    return this.shops;
  }

  getReasons() {
    this.reasons = [];
    this.restApiService.get(PathConstants.ReasonMasterGetURL).subscribe(reason => {
      reason.forEach(r => {
        this.reasons.push({ 'name': r.reason, 'id': r.reason_id, 'type': r.reason_type });
      });
    });
    return this.reasons;
  }

  getBugStatus() {
    this.bugStatus = [];
    this.restApiService.get(PathConstants.BugStatus).subscribe(bugstatus => {
      bugstatus.forEach(bs => {
        this.bugStatus.push({ 'name': bs.value, 'id': bs.id });
      });
    });
    return this.bugStatus;
  }

  getComponentCC() {
    this.cc = [];
    this.restApiService.get(PathConstants.ComponentCC).subscribe(cc => {
      cc.forEach(cc => {
        this.cc.push({ 'name': cc.login_name, 'id': cc.component_id, 'assignee': cc.realname });
      });
    });
    return this.cc;
  }
}
