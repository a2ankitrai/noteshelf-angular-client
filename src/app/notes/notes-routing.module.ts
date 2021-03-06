import { AuthenticationGuard } from './../common/guard/authentication.guard';
import { CanDeactivateNoteEditGuard } from './guard/can-deactivate-note-edit.guard';
import { NotesResolverService } from './resolver/notes-resolver.service';
import { NotesEditComponent } from './notes-edit/notes-edit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesComponent } from './notes/notes.component';

const routes: Routes = [
  { path: 'notes', component: NotesComponent, canActivate: [AuthenticationGuard] },
  { path: 'create-note', component: NotesEditComponent, canActivate: [AuthenticationGuard], canDeactivate: [CanDeactivateNoteEditGuard] },
  {
    path: 'edit-note/:id', component: NotesEditComponent, canActivate: [AuthenticationGuard], resolve: {
      note: NotesResolverService
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [NotesResolverService, CanDeactivateNoteEditGuard]
})
export class NotesRoutingModule { }
