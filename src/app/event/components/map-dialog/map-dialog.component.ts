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

  constructor(
    private dialogRef: MatDialogRef<MapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) location: EventLocation,
  ) {
    this.location = location;
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
