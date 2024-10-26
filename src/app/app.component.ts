import { Component } from '@angular/core';
import { DataService } from './data.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { Color } from '@swimlane/ngx-charts';
import '../styles.css';
import { OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'EV Dashboard';
  evData: any[] = [];
  vehicleTypes: any[] = [];
  modelYears: any[] = [];
  isLoading = true;
  typeData: any[] = [];
  countyData: any[] = [];
  topMakesData: any[] = [];
  displayedColumns: string[] = ['Make', 'Model Year', 'Electric Vehicle Type', 'Electric Range', 'County'];

  showPieV: boolean= false;
  showModelNum: boolean = false;
  showCountry: boolean = false;
  showTop: boolean = false;

  

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.getCsvData().subscribe(
      data => {
        console.log('Parsed data:', data); // To verify data structure
        this.evData = data;
        this.processData();
        // this.prepareTypeData(data);
        
      },
      error => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    );
  }

  processData() {
    // Count by Electric Vehicle Type
    this.vehicleTypes = this.evData.reduce((acc, curr) => {
      const type = curr['Electric Vehicle Type']?? 'Unknown'; //for some null or undefined values
      const found = acc.find((item:any) => item.name === type);
      if (found) {
        found.value += 1;
      } else {
        acc.push({ name: type, value: 1 });
      }
      return acc;
    }, []);

    // Count by Model Year
    this.modelYears = this.evData.reduce((acc, curr) => {
      const year = curr['Model Year']? curr['Model Year'].toString() : 'Unknown';
      const found = acc.find((item:any) => item.name === year);
      if (found) {
        found.value += 1;
      } else {
        acc.push({ name: year, value: 1 });
      }
      return acc;
    }, []);
    const countyCount = this.evData.reduce((acc, curr) => {
      const county = curr['County'];
      acc[county] = (acc[county] || 0) + 1;
      return acc;
    }, {});

    this.countyData = Object.keys(countyCount).map((county) => ({
      name: county,
      value: countyCount[county]
    }));
    const makeCount = this.evData.reduce((acc, curr) => {
      const make = curr['Make'];
      acc[make] = (acc[make] || 0) + 1;
      return acc;
    }, {});
    const sortedMakes = Object.keys(makeCount)
    .map((make) => ({ name: make, value: makeCount[make] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);  // Top 5 makes

    this.topMakesData = sortedMakes;
  }

  clickEvType(){
    this.showPieV= !this.showPieV;
  }
  clickModelNum(){
    this.showModelNum = !this.showModelNum;
  }
  clickCountry(){
    this.showCountry = !this.showCountry;
  }
  clickTop(){
    this.showTop=!this.showTop;
  }
}

