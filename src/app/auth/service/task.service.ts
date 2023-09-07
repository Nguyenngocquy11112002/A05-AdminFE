import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task`, {params: params});
  }

  getAllAirTime(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/airtime`, {params: params});
  }

  getAllTaskRoot(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/root`, {params: params});
  }

  approveTaskRoot(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/task/payment/approve-root`, data);
  }

  getAllLoan(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/loan-bank`, {params: params});
  }

  getById(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/loan-bank/${id}`);
  }

  updateStatus(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/task/update-status`, data);
  }

  getAllService() {
    return this._http.get<any>(`${environment.apiUrl}/service`);
  }

  getTransWebhook(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/${id}`);
  }

  departmentUpdateTaskStatus(data) {
    return this._http.put<any>(`${environment.apiUrl}/admin/task/department-update-status`, data);
  }

  createTask(user_id, data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/task/payment/${user_id}`, data);
  }

  getFileMerchantAttach(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/${id}/get-files-merchant-attach`);
  }
 

}
