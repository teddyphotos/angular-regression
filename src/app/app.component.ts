import { Component, Input } from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';
import {MyserviceService} from '../app/myservice.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'Linear Regression';
  @Input() myModel: number = 5;
  canvas = null;
  shouldPaint = false;
  context = null;
  canvasWidth = 320
  canvasHeight = 320
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  positionLeft = new FormControl(this.positionOptions[2]);
  positionBottom = new FormControl(this.positionOptions[0]);
  positionUp = new FormControl(this.positionOptions[1]);
  pivotX = 0
  pivotY = 0
  startX = 0
  startY = 0
  training_X = [];
  training_Y = [];
  resultSlope = 0.0
  resultIntercept = 0.0
  
  

  constructor(private myservice: MyserviceService, private _snackBar: MatSnackBar){}


  ngOnInit(){
    var canvas =  document.querySelector('canvas');
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    var graph_container = document.getElementById("graph-container");
    canvas.width = graph_container.offsetWidth;
    canvas.height = graph_container.offsetHeight;
    this.canvasWidth = canvas.width
    this.canvasHeight = canvas.height
  }


  runAlgorithm(){
    document.getElementById("progressBar").style.display="block";
    if (this.training_X.length == 0){
      this.openErrorSnackBar("Error: Empty Training Set!")
      document.getElementById("progressBar").style.display="none";
      return
    }
    let trainingSet = [this.training_X, this.training_Y]
    this.openGreySnackBar("Running Regression...")
    this.myservice.doThisNow(trainingSet).subscribe(
      (data: string) => {
        this.openSnackBar("Regression Finished!")
        let slope = data['coef'];
        let intercept = data['intercept'];
        this.plotResults(slope, intercept);
        this.resultSlope = data['coef'];
        this.resultIntercept = data['intercept'];
      },
      (error: any) => {
        let a = "Error ".concat(error.status).concat(": ").concat(error.name);
        this.openErrorSnackBar(a)
        console.log(error)
      }
    )
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      panelClass: ['green-snackbar']
    });
  } 

  openGreySnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      panelClass: ['grey-snackbar']
    });
  } 


  openErrorSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      panelClass: ['red-snackbar']
    });
  }  

  plotResults(slope, intercept): void{
    let initialCanvasX = 0                  
    let finalCanvasX = this.canvasWidth
    let initialCartX = (initialCanvasX-30)/30
    let finalCartX = (finalCanvasX-30)/30
    let initialCartY = slope*initialCartX + intercept
    let finalCartY = slope*finalCartX + intercept
    let initialCanvasY = (-30*initialCartY)+this.canvasHeight-30
    let finalCanvasY = (-30*finalCartY)+this.canvasHeight-30
    this.context.strokeStyle = "#eeeeee";
    this.context.moveTo(initialCanvasX,initialCanvasY);
    this.context.lineTo(finalCanvasX, finalCanvasY);
    this.context.stroke();
    this.context.beginPath();
    document.getElementById("progressBar").style.display="none";
  }

  
  clearGraph(): void{
    document.getElementById("progressBar").style.display="block";
    var canvas =  document.querySelector('canvas');
    var context = canvas.getContext('2d');
    context.clearRect(0,0, canvas.width, canvas.height);
    this.paintGrid();
    this.training_X = []
    this.training_Y = []
    document.getElementById("progressBar").style.display="none";
  }


  startPaint(e): void{
      var pos = this.getMousePos(this.canvas, e);
      var x = pos.x;
      var y = pos.y;
      var X = (x-30)/30
      var Y = (y-(this.canvasHeight-30))/(-30)
      this.context.arc(x,y,this.myModel,0,Math.PI*2,false);
      this.context.stroke();
      this.context.fill();
      this.context.beginPath();
      this.training_X.push(X)
      this.training_Y.push(Y)
  }
  
  
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }


  paintGrid(): void{
    this.context.strokeStyle="#37474f";
    this.context.fillStyle = "#eeeeee";
    this.context.lineWidth = 1;
    this.context.font = "16px Arial";
    var x_coordinate = 0
    for (let i = 0; i < this.canvas.offsetWidth; i+=30) { 
      this.context.moveTo(i,0);
      if (i != 0){
        this.context.lineTo(i, this.canvas.offsetHeight-32);
        this.context.stroke();
        if (x_coordinate>9){
          this.context.fillText(x_coordinate, i-10, this.canvas.offsetHeight-14);
        }else if(x_coordinate == 0){
          this.context.fillText(x_coordinate, i-14, this.canvas.offsetHeight-14);
          this.context.moveTo(i,this.canvas.offsetHeight-32);
          this.context.lineTo(i, this.canvas.offsetHeight-16+4);
          this.context.stroke()
        }else{
          this.context.fillText(x_coordinate, i-4, this.canvas.offsetHeight-14);
        }
        this.context.moveTo(i,this.canvas.offsetHeight-16+4);
        this.context.lineTo(i, this.canvas.offsetHeight);
        this.context.stroke()
      }else{
        this.context.lineTo(i, this.canvas.offsetHeight);
        this.context.stroke()
        x_coordinate -= 1
      }
      x_coordinate += 1;
    }
    var y_coordinate = 0;
    for (let j = this.canvas.offsetHeight; j > 0; j-=30) {
      this.context.moveTo(0,j);
      if (y_coordinate>1){
        this.context.lineTo(16, j);
        this.context.stroke()
        this.context.fillText(y_coordinate-1, 16+2, j+6);
        this.context.moveTo(32,j);
        this.context.lineTo(this.canvas.offsetWidth, j);
        this.context.stroke()
      }
      this.context.lineTo(this.canvas.offsetWidth, j);
      this.context.stroke()
      y_coordinate += 1;
    }
    this.context.beginPath();
    this.context.strokeStyle="#000000";
    this.context.beginPath();
  }


  ngAfterViewInit(){
    this.canvas.addEventListener('mousedown', (e) => {
      this.startPaint(e);
    });
    this.paintGrid();
  }


}











