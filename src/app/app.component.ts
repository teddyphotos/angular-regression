import { Component, Input } from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';
import {MyserviceService} from '../app/myservice.service';

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
  // trainingSet = [];
  training_X = [];
  training_Y = [];
  numberOfEpochs = 100
  


  constructor(private myservice: MyserviceService){}


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
    console.log("Running Algorithm")
    console.log("Calling Service!!!")
    let trainingSet = [this.training_X, this.training_Y]
    this.myservice.doThisNow(trainingSet).subscribe(
      (data: string) => {
        console.log("Received Callback from Backedn => ", data)
        console.log("data['coef'] = ", data['coef'])
        let slope = data['coef']
        let intercept = data['intercept']
        this.plotResults(slope, intercept);

        
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  plotResults(slope, intercept): void{
    // I need a line that spans entire width of canvas
    let initialCanvasX = 0                  // Fixed and True
    let finalCanvasX = this.canvasWidth     // Fixed and True


    // Convert canvas coordinates to cartesian x
    let initialCartX = (initialCanvasX-30)/30
    let finalCartX = (finalCanvasX-30)/30


    // For each cartesian x find cartesian y from line
    let initialCartY = slope*initialCartX + intercept
    let finalCartY = slope*finalCartX + intercept


    // Convert cartesian y to canvas y
    let initialCanvasY = (-30*initialCartY)+this.canvasHeight-30
    let finalCanvasY = (-30*finalCartY)+this.canvasHeight-30


    // Plot Line from canvas x to canvas y


    
    this.context.moveTo(initialCanvasX,initialCanvasY);
    this.context.lineTo(finalCanvasX, finalCanvasY);
    this.context.stroke();
    this.context.beginPath();


  }

  solveForCanvasY(canvasX, slope, intercept): number{
    return (slope*(30*canvasX+30)+intercept+30-this.canvasHeight)/(-30)
  }

  
  clearGraph(): void{
    var canvas =  document.querySelector('canvas');
    var context = canvas.getContext('2d');
    context.clearRect(0,0, canvas.width, canvas.height);
    this.paintGrid();
    // this.trainingSet = []
    // console.log("Training Set Emptied => ", this.trainingSet);
    this.training_X = []
    this.training_Y = []
    console.log("Training Set Cleared!")
    console.log("Training_X is ",this.training_X, " and training_Y is ", this.training_Y);

    
  }

  getRandomInt(max): number{
    return Math.floor(Math.random() * Math.floor(max));
  }

  
  startPaint(e): void{
      // Getting the canvas coordinates
      var pos = this.getMousePos(this.canvas, e);
      var x = pos.x;
      var y = pos.y;
      var X = (x-30)/30
      var Y = (y-(this.canvasHeight-30))/(-30)
      this.context.arc(x,y,this.myModel,0,Math.PI*2,false);
      this.context.stroke();
      this.context.fill();
      this.context.beginPath();
      console.log("(x,y) = ", "(",X,",",Y,")");
      // let a = [X,Y];
      // this.trainingSet.push(a)
      this.training_X.push(X)
      this.training_Y.push(Y)
      console.log("Training_X is ",this.training_X, " and training_Y is ", this.training_Y);


      
  }
  
  // OLD START PAINT FUNCTION TO PAINT ON CANVAS -x-x-x-x--x-x-x-xx--x-x-x
  // startPaint(e): void{
  //     this.shouldPaint = true;
  //     this.paint(e);
  // }

  // OLD STOP PAINT FUNCTION
  // stopPaint(): void{
  //     this.shouldPaint = false;
  //     this.context.beginPath()
  // }

  // OLD PAINT FUNCTION USED TO PAINT ON THE CANVAS
  // paint(e): void{
  //   if (!this.shouldPaint){
  //     return;
  //   }
  //   var pos = this.getMousePos(this.canvas, e);
  //   this.context.lineWidth = this.myModel;
  //   this.context.lineCap = 'round';
  //   this.context.lineTo(pos.x, pos.y);
  //   this.context.stroke()
  //   this.context.beginPath();
  //   this.context.moveTo(pos.x, pos.y);
  // }



  // NEW START PAINT FUNCTION TO MOVE GRID -------------------------------
  // startPaint(e): void{
  //   this.shouldPaint = true;
  //   this.context.strokeStyle="#eeeeee";
  //   this.context.lineWidth = 1;
  //   var pos = this.getMousePos(this.canvas, e);
  //   this.pivotX = pos.x;
  //   this.pivotY = pos.y;
  // }


  // stopPaint(e): void{
  //   this.shouldPaint = false; 
  //   var pos = this.getMousePos(this.canvas, e);
  //   let diffX = pos.x - this.pivotX;
  //   let diffY = pos.y - this.pivotY; 
  //   this.startX = this.startX + diffX;
  //   this.startY = this.startY + diffY;
  // }


  // This Paint method redraws the entire grid everytime the user moves the mouse
  // To user it appears as if he is moving the grid
  // paint(e): void{
  //   if (!this.shouldPaint){
  //     return;
  //   }
  //   this.context.clearRect(0,0, this.canvas.width, this.canvas.height);

  //   var pos = this.getMousePos(this.canvas, e);
  //   let diffX = pos.x - this.pivotX;
  //   let diffY = pos.y - this.pivotY;

  //   this.context.strokeStyle="#eeeeee";
  //   this.context.lineWidth = 1;
    
  //   for (let i = (this.startX+(diffX%30))%30; i < this.canvas.offsetWidth; i+=30) { 
  //     this.context.moveTo(i,0);
  //     this.context.lineTo(i, this.canvas.offsetHeight);
  //     this.context.stroke()
  //   }
  //   for (let i = (this.startY+(diffY%30))%30; i < this.canvas.offsetHeight; i+=30) {
  //     this.context.moveTo(0,i);
  //     this.context.lineTo(this.canvas.offsetWidth, i);
  //     this.context.stroke()
  //   }

  //   this.context.beginPath()
    
  // }





  
  
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  


  paintGrid(): void{
    this.context.strokeStyle="#eeeeee";
    this.context.lineWidth = 1;
    this.context.font = "16px Arial";
    
    // This generates Verticle lines with coordinates
    var x_coordinate = 0
    for (let i = 0; i < this.canvas.offsetWidth; i+=30) { 
      this.context.moveTo(i,0);
      if (i != 0){
        // This generates number line on bottom of screen
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
        // i is 0
        this.context.lineTo(i, this.canvas.offsetHeight);
        this.context.stroke()
        x_coordinate -= 1
      }
      x_coordinate += 1;
    }
    
    // This generates Horizontal lines with coordinates
    var y_coordinate = 0;
    for (let j = this.canvas.offsetHeight; j > 0; j-=30) {
      this.context.moveTo(0,j);
      if (y_coordinate>1){
        // this.context.lineTo(this.canvas.offsetWidth, j);
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
    // this.canvas.addEventListener('mouseup', (e) => {
    //   this.stopPaint(e);
    // });
    // this.canvas.addEventListener('mousemove', (e) => {
    //   this.paint(e);
    // })
    this.paintGrid();
  }


}











