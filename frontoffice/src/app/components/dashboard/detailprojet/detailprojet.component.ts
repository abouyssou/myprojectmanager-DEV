import { Component, OnInit } from '@angular/core';
import { IssuesService } from 'src/app/services/issues.service';
import { NgForm } from '@angular/forms';
import { ProjetService } from 'src/app/services/projet.service';
import { ActivatedRoute } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-detailprojet',
  templateUrl: './detailprojet.component.html',
  styleUrls: ['./detailprojet.component.scss']
})
export class DetailprojetComponent implements OnInit {


  public project_id;
  public issues = [];

  public project : Projet;
  

  constructor(private issuesService : IssuesService, 
              private projetService : ProjetService, 
              private tasksService : TasksService,
              private route: ActivatedRoute) { }

  
  modelIssue = {
    issueID: '',
    description: '',
    priorite: '',
    difficulte: '0',
    status: '0'
  }

  modelIssueEdit = {
    _id:'',
    issueID: '',
    description: '',
    priorite: '',
    difficulte: '0',
    status: '0'
  }

  modelTask = {
    description: '',
    cout: '',
    developer: ''
  }

  modelproject = {
    title: '',
    description: ''
  }

  ngOnInit() {   
    this.project_id = this.route.snapshot.paramMap.get('id');
    this.getProject();
  }


  getProject(){
    this.projetService.getProject(this.project_id).subscribe(data => {
      this.project = data['project']
      this.modelproject.title = this.project.title;
      this.modelproject.description = this.project.description;
    });
  }

  removeIssue(id){
    this.issuesService.removeIssue(this.project['_id'],id).subscribe(data => this.getProject());
    
 }



  onSubmitIssue(form: NgForm) {
    this.issuesService.addIssue(this.project['_id'],form.value).subscribe(
      res => {
        form.resetForm();
        this.modelIssue.status = '0';
        this.modelIssue.difficulte = '0';
        this.getProject()
      },
      err => {
        console.log(err);
      }
    );
  }


  onSubmitTask(form: NgForm) {
    this.tasksService.addTask(this.project['_id'],form.value).subscribe(
      res => {
        form.resetForm();
        this.getProject()
      },
      err => {
        console.log(err);
      }
    );
    console.log(this.project)
  }



  editProject(form: NgForm) {
    console.log(form.value)
    if(form.value.title === "" || form.value.description === ""){
      this.getProject();
      return;
    }
    this.projetService.editProject(this.project['_id'],form.value).subscribe(
      res => {
       this.getProject()
  
      },
      err => {
        console.log(err);
      }
    );
    console.log(this.project)
  }
  updateModalEdit(issue){
    this.modelIssueEdit._id = issue._id;
    this.modelIssueEdit.issueID = issue.issueID;
    this.modelIssueEdit.description = issue.description;
    this.modelIssueEdit.priorite = issue.priorite;
    this.modelIssueEdit.difficulte = issue.difficulte;
    this.modelIssueEdit.status = issue.status;
    console.log(this.modelIssueEdit._id);
  }

  onSubmitEditIssue(form: NgForm) {
    this.issuesService.editIssue(this.project['_id'],this.modelIssueEdit._id,form.value).subscribe(
      res => {
        form.resetForm();
        this.modelIssue.status = '0';
        this.modelIssue.difficulte = '0';
        this.getProject()
      },
      err => {
        console.log(err);
      }
    );
  }

}
