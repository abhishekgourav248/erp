import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.css'
})
export class TimesheetComponent implements OnInit{
  private path : string = "";
  constructor(private route : ActivatedRoute){}

  ngOnInit(): void {
    
  }
}
