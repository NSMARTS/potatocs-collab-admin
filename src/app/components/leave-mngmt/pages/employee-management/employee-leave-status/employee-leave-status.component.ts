import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeMngmtService } from 'src/app/services/admin/ad-employee-mngmt/employee-mngmt.service';
//table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//auto complete
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LeaveRequestDetailsComponent } from '../../../components/leave-request-details/leave-request-details.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common/common.service';

// view table
export interface PeriodicElement {
  startDate: Date;
  endDate: Date;
  name: string;
  leaveType: string;
  duration: number;
  email: string;
}

export interface Employees {
  _id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-employee-leave-status',
  templateUrl: './employee-leave-status.component.html',
  styleUrls: ['./employee-leave-status.component.scss']
})



export class EmployeeLeaveStatusComponent implements OnInit {

  // auto complete
  myControl = new FormControl();
  options: Employees[];
  filteredOptions: Observable<Employees[]>;

  // view table
  displayedColumns: string[] = ['startDate', 'endDate', 'name', 'emailFind','leaveType', 'duration','status',];
  dataSource

  employeeForm: FormGroup
  viewType = {
		'annual_leave': 'Annual Leave',
		'sick_leave': 'Sick Leave',
		'replacementday_leave': 'Replacement Day'
	}

  searchStr = '';

  // 이번 달 1일, 말일 만드는 변수
  date = new Date();
  monthFirst = new Date(this.date.setDate(1));
  tmp = new Date(this.date.setMonth(this.date.getMonth() + 4));
  monthLast = new Date(this.tmp.setDate(0));


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private employeeMngmtService: EmployeeMngmtService,
    public dialog: MatDialog,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      type: ['all', [
        Validators.required,
      ]],
      leave_start_date: [this.monthFirst.toISOString(), [
        Validators.required,
      ]],
      leave_end_date: [this.monthLast.toISOString(), [
        Validators.required,
      ]],
      emailFind: ['', [
        Validators.required,
      ]]
    });
    this.myEmployeeLeaveListSearch();

  }

  setAutoComplete() {
    // auto complete
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.email),
      map((email:any) => email ? this._filter(email) : this.options.slice())
    );

    console.log(this.filteredOptions);
  }

  //auto
  // displayFn(employee: Employees): string {
  //   return employee && employee.email ? employee.email : '';
  // }
  // getOptionText(employee: Employees) {
  //   return employee.email ? employee.email : '';
  // }
  private _filter(email: string): Employees[] {
    const filterValue = email.toLowerCase();
    return this.options.filter(option => option.email.toLowerCase().includes(filterValue));
  }

  myEmployeeLeaveListSearch() {
    let myEmployeeInfo;
    const formValue = this.employeeForm.value;

    console.log(this.myControl.value);

    myEmployeeInfo = {
      type: formValue.type,
      leave_start_date: formValue.leave_start_date,
      leave_end_date: formValue.leave_end_date,
      emailFind: this.myControl.value,
    }

    console.log(myEmployeeInfo);

    // 조건에 따른 사원들 휴가 가져오기
    this.employeeMngmtService.getEmployeeLeaveListSearch(myEmployeeInfo).subscribe(
      (data: any) => {
        console.log(data.message);
        console.log(data.myEmployeeLeaveListSearch);

        data.myEmployeeLeaveListSearch = data.myEmployeeLeaveListSearch.map ((item)=> {
					item.startDate = this.commonService.dateFormatting(item.startDate, 'timeZone');
					item.endDate = this.commonService.dateFormatting(item.endDate, 'timeZone');
					return item;
				});

        this.dataSource = new MatTableDataSource<PeriodicElement>(data.myEmployeeLeaveListSearch);
        this.dataSource.paginator = this.paginator;

        this.options = data.myEmployeeList;
        this.setAutoComplete();
        console.log(this.options);
      }
    )
  }
  openDialogPendingLeaveDetail(data) {

		const dialogRef = this.dialog.open(LeaveRequestDetailsComponent, {
			// width: '600px',
			// height: '614px',

			data: {
				requestor: data._id,
				requestorName: data.name,
				leaveType: data.leaveType,
				leaveDuration: data.duration,
				leave_end_date: data.endDate,
				leave_start_date: data.startDate,
				leave_reason: data.leave_reason,
				status: data.status,
				createdAt: data.createdAt,
				approver: data.approver,
        rejectReason: data.rejectReason
			}

		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('dialog close');
		})
	}
}
