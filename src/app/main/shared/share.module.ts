import { NgModule } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ViewFileContractComponent } from '../shared/view-file-contract/view-file-contract.component';
import { PoupViewImageComponent } from './poup-view-image/poup-view-image.component';
import { ThongTinThueBaoComponent } from './thong-tin-thue-bao/thong-tin-thue-bao.component';
import { FormPersonalComponent } from './form-personal/form-personal.component';
import { FormOrganirationComponent } from './form-organiration/form-organiration.component';
import { OrganizationDocComponent } from './organization-doc/organization-doc.component';


@NgModule({
  declarations: [
    ViewFileContractComponent,
    PoupViewImageComponent,    
    ThongTinThueBaoComponent, FormPersonalComponent, FormOrganirationComponent, OrganizationDocComponent
  ],
  imports: [
    CoreCommonModule
  ],
  exports: [
    ViewFileContractComponent,
    PoupViewImageComponent,
    ThongTinThueBaoComponent,
    FormPersonalComponent, FormOrganirationComponent,
    OrganizationDocComponent
  ]
})
export class SharedModule { }
