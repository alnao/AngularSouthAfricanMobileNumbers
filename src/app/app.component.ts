import { HttpClient } from '@angular/common/http';
import { NullTemplateVisitor } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from './upload.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SAMV';
  list : SouthAfricanMobileNumbers[];
  showForm : boolean;
  file:File;
  arrayBuffer:any;
  
  constructor(private service:UploadService){
    this.showForm = true;
  }

  reset(){this.showForm=!this.showForm;}

  fileChanged(event) {
    this.file= event.target.files[0]; 
  }
  uploadFile(){//https://stackoverflow.com/questions/47151035/angular-4-how-to-read-data-from-excel
    let fileReader = new FileReader();
    //load and parse excel file
    fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
        this.callService(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
    }
    fileReader.readAsArrayBuffer(this.file);
    
  }
  callService(schema) {
    this.list = [];
    console.log(schema);
    console.log(typeof schema);
    //create list 
    for (let i=0;i<schema.length;i++){
      console.log(schema[i]);
      this.list.push(
        {idNumber : schema[i]["id"]
          ,phoneNumber : schema[i]["sms_phone"]
          ,type:''}
      );
    }
    //cal service
    this.service.upload(this.list).subscribe((res) =>{
      this.list=res;
      this.showForm=false;
    } );
  }

  valueToCheck :string; 
  checkResult : string;
  checkResultClass : string;
  numberChanged(e){
    this.valueToCheck=e.target.value;
    console.log(this.valueToCheck);
    this.checkResult='';
  }
  checkumber(){
    this.list=[{idNumber : 'TEST',phoneNumber : this.valueToCheck,type:''}];
    this.service.upload(this.list).subscribe((res) =>{
      this.checkResult=res[0].type;
      this.checkResultClass="text-success";
      if (this.checkResult==='KO'){
        this.checkResultClass="text-danger";
      }
      this.showForm=true;
    } );
    
  }
  getRowClass(el){
    if (el.type==="OK"){return "bg-success text-dark";}
    if (el.type==="KO"){return "bg-warning text-dark";}
  }
}
export interface SouthAfricanMobileNumbers{
  idNumber : string;
  phoneNumber : string;
  type: string;
  
}