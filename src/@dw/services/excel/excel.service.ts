import { NgIf, SlicePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

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


    public exportToFile(data:any) {

        // export Array to Worksheet of Excel. only array possible
        // https://lovemewithoutall.github.io/it/json-to-excel/
        
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
                "The display format must be 'general'. If there is an '*', there must be a value.": ''
            }];
        } else {
            for (let i = 0; i < data.length; i++) {

                array.push({
                    "Employee Name": data[i]?.name,
                    "ID ( E-mail ) *": data[i].email,
                    "Department": data[i]?.department,
                    "Position": data[i]?.position,
                    "Start Date *": data[i].emp_start_date ? moment(data[i].emp_start_date).format('YYYY-MM-DD') : null,
                    "End Date": data[i]?.emp_end_date ? moment(data[i].emp_start_date).format('YYYY-MM-DD') : null,
                    "Manager ID ( E-mail )": data[i]?.managerId,
                })
            }
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

    // Employee Leave Status 정보 엑셀로 추출
    public exportToData(data:any) {

        // export Array to Worksheet of Excel. only array possible
        // https://lovemewithoutall.github.io/it/json-to-excel/
        
        let array = []
    
        for (let i = 0; i < data.length; i++) {
            array.push({
                "Start Date": data[i]?.startDate,
                "End Date": data[i].endDate,
                "Employee Name": data[i]?.name,
                "Employee Email": data[i]?.email,
                "Type": data[i]?.leaveType,
                "Day(s)": data[i]?.duration,
                "Status": data[i]?.status,
            })
        }
        
        var ws = XLSX.utils.json_to_sheet(array);
        // A workbook is the name given to an Excel file
        var wb = XLSX.utils.book_new()  // make Workbook of Excel
        // add Worksheet to Workbook
        // Workbook contains one or more worksheets
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
         // export Excel file
        XLSX.writeFile(wb, 'employee_leave_status.xlsx');
    }
}
