import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

// https://github.com/Touwin10/angular-excel
@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }


    public importFromFile(bstr: string): XLSX.AOA2SheetOpts {
        /* read workbook */
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

        return data;
    }


    public exportToFile(data) {

        // export Array to Worksheet of Excel. only array possible
        // https://lovemewithoutall.github.io/it/json-to-excel/
        
        console.log(data)
        let array = []

        if(data=='') {
            array = [{
                "Employee Name": "James Lee",
                 "ID ( E-mail ) *":"james@gmail.com",
                 "Department":"",
                 "Position":"",
                 "Start Date *":"2022-01-26",
                 "End Date": "",
                 "Manager ID ( E-mail )": "manager@gmail.com",
            }];
        } else {
            
            array = data;
        }
        
        var ws = XLSX.utils.json_to_sheet(array);
        
        // A workbook is the name given to an Excel file
        var wb = XLSX.utils.book_new()  // make Workbook of Excel
        // add Worksheet to Workbook
        // Workbook contains one or more worksheets
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
         // export Excel file
        XLSX.writeFile(wb, 'employee_list.xlsx');
    }
}
