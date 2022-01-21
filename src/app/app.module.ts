import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgMaterialUIModule } from './ng-material-ui/ng-material-ui.module';

// Module
import { AuthModule } from './pages/auth/auth.module';
import { ApproutingModule } from './app-routing.module';

// Guard
import { SignInGuard } from '../@dw/guard/signIn.guard';

// Component
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index/index.component';
// import { LeaveMngmtModule } from './components/leave-mngmt/leave-mngmt.module';
import { CollaborationModule } from '../app/@layout/collaboration.module'
import { DialogModule } from '../@dw/dialog/dialog.module'
import { CollaborationComponent } from './@layout/collaboration.component';
import { ToolbarModule } from './@layout/toolbar/toolbar.module';
import { SidenavModule } from './@layout/sidenav/sidenav.module';

// Env
import { environment } from 'src/environments/environment';
import { AdminGuard } from 'src/@dw/guard/admin.guard';

export function tokenGetter() {
	return localStorage.getItem(environment.tokenName);
}
@NgModule({
    declarations: [
      AppComponent,
      IndexComponent,
      CollaborationComponent
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      NgMaterialUIModule,
      FormsModule,
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          disallowedRoutes: [
            '/api/v1/auth/sign-in',
		        '/api/v1/auth/sign-up',
          ]
        }
      }),
      AuthModule,
      CollaborationModule,
      DialogModule,
      ToolbarModule,
      SidenavModule,
      ApproutingModule,
    ],
    providers: [SignInGuard, AdminGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }


