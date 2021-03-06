import { ProfilePictureResolver } from './resolver/profile-picture.resolver';
import { ProfileResolverService } from './resolver/profile-resolver.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthenticationGuard } from '../common/guard/authentication.guard';

const routes: Routes = [
  {
    path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard],
    resolve: {
      profile: ProfileResolverService,
      profilePicture: ProfilePictureResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ProfileResolverService]
})
export class ProfileRoutingModule { }
