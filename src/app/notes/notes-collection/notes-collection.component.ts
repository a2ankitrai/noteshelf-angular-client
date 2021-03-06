import { NsCommonService } from './../../common/service/ns-common.service';
import { Note } from './../model/note.model';
import { NotesService } from './../service/notes.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { zoomInAnimation, enterAnimation } from 'src/app/common/animations/animations';

@Component({
  selector: 'app-notes-collection',
  templateUrl: './notes-collection.component.html',
  styleUrls: ['./notes-collection.component.css'],
  animations: [
    zoomInAnimation,
    enterAnimation
  ]
})
export class NotesCollectionComponent implements OnInit {

  constructor(private notesService: NotesService, private commonService: NsCommonService, private router: Router) {
    console.log('NotesCollectionComponent constructor');
  }

  zoomInAnimation: any;
  enterAnimation: any;
  notesMap: Map<string, Note>;

  ngOnInit() {
    console.log('NotesCollectionComponent ngOnInit');

    this.notesService.notesMapObservable.subscribe(notesMap => {
      this.notesMap = notesMap;
    });

    this.notesService.populateNotesMap();

  }

  isNotesMapEmpty() {
    return this.notesMap === undefined || this.notesMap.size === 0;
  }

}
