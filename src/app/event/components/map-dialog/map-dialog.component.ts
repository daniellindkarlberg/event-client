import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventLocation } from '@event/models';

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.scss'],
})
export class MapDialogComponent {
  location = {} as EventLocation;
  width = 0;
  height = 0;

  constructor(
    private dialogRef: MatDialogRef<MapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) { location, width, height },
  ) {
    this.location = location;
    this.width = width;
    this.height = height;
  }

  locationChange(location: EventLocation) {
    this.location = location;
  }

  save() {
    this.dialogRef.close(this.location);
  }

  close() {
    this.dialogRef.close(false);
  }
}
