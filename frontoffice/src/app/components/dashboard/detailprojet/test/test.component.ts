import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { TestsService } from 'src/app/services/tests.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {
  project_id;
  tests = [];
  modelTest = {
    title: '',
    description: '',
    type: '0',
    date: '',
    link: '',
    status: '0'
  }

  modelTestEdit = {
    _id: '',
    title: '',
    description: '',
    type: '0',
    date: '',
    link: '',
    status: '0'
  }

  modelDate;

  constructor(private testsService: TestsService,
              private route: ActivatedRoute,
              private calendar: NgbCalendar) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.project_id = params['id'];
    })
    this.getTests();
    this.modelDate = this.calendar.getToday();
  }

  getTests() {
    this.testsService.getTests(this.project_id).subscribe(data => this.tests = data['tests']);
  }

  onSubmitTest(form: NgForm){
    let date = form.value.dp;
    form.value.dp = date.day+ "/" +date.month + "/" + date.year;
    this.testsService.addTest(this.project_id, form.value).subscribe(
      res => {
        form.resetForm();
        this.getTests()
      },
      err => {
        console.log(err);
      }
    );
  }

  removeTest(id) {
    this.testsService.removeTest(this.project_id, id).subscribe(data => this.getTests());
  }

  updateModalEditTest(test) {
    this.modelTestEdit._id = test._id;
    this.modelTestEdit.title = test.title;
    this.modelTestEdit.description = test.description;
    this.modelTestEdit.type = test.type;
    this.modelTestEdit.date = test.date;
    this.modelTestEdit.link = test.link;
    this.modelTestEdit.status = test.status;
  }

  onSubmitEditTest(form: NgForm) {
    let date = form.value.dp;
    form.value.dp = date.day+ "/" +date.month + "/" + date.year;
    this.testsService.editTest(this.project_id, this.modelTestEdit._id, form.value).subscribe(
      res => {
        form.resetForm();
        this.getTests()
      },
      err => {
        console.log(err);
      }
    );
  }
}
