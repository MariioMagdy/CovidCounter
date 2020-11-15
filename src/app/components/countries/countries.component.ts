import { Component, OnInit } from '@angular/core';

import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  constructor(private _service:DataServiceService) { }
  data:GlobalDataSummary;
  countries: string[]=[]
  totalConfirm=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
  selectedCountryData: DateWiseData[];
  dateWiseData;
  dataTable =[];
  
  Loading =true;
  chart={
    PieChart:"PieChart",
    ColumnChart:"ColumnChart",
    height:500,
    LineChart:"LineChart",
    options: {
        animation:{
          duration: 1000,
          easing: 'out',
        },
        is3D:true
    }
  

  }

  // options: {
  //   height:500,
  //     animation:{
  //       duration: 1000,
  //       easing: 'out',
  //     },
  // }

  
  // lineChart: GoogleChartInterface={
  //   chartType:"LineChart"
  // }


 
  ngOnInit(): void {

    merge(
      this._service.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ), 
      this._service.getGlobalData().pipe(map(result=>{
        this.data = result;
        this.data.forEach(cs=>{
          this.countries.push(cs.country)
        })
  
      }))
    ).subscribe({
      complete:()=>{
      this.updateValues("Egypt")
      this.Loading=false
      }
    })

    this._service.getDateWiseData().subscribe(result=>{
      this.dateWiseData=result
      this.updateChart();

    })
  

  }

  updateChart(){
    this.dataTable=[];
  
    // this.dataTable.push(["Date","Cases"])
    this.selectedCountryData.forEach(cs=>{
      this.dataTable.push([cs.date,cs.cases])
    })
    
  }
  updateValues(country:string){
    console.log(country)
    this.data.forEach(cs=>{
      if(cs.country == country){
        this.totalActive =cs.active
        this.totalDeaths =cs.deaths
        this.totalRecovered =cs.recovered
        this.totalConfirm =cs.confirmed
      }
    })
    this.selectedCountryData=this.dateWiseData[country];
    console.log(this.selectedCountryData)
    this.updateChart()
  }

}
