import { Component, Input } from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';

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



  clearGraph(): void{
    var canvas =  document.querySelector('canvas');
    var context = canvas.getContext('2d');
    context.clearRect(0,0, canvas.width, canvas.height);
    this.paintGrid();
  }

  getRandomInt(max): number{
    return Math.floor(Math.random() * Math.floor(max));
  }
  
  // OLD START PAINT FUNCTION TO PAINT ON CANVAS
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
  startPaint(e): void{
    this.shouldPaint = true;
    this.context.strokeStyle="#eeeeee";
    this.context.lineWidth = 1;
    var pos = this.getMousePos(this.canvas, e);
    this.pivotX = pos.x;
    this.pivotY = pos.y;
  }


  stopPaint(e): void{
    this.shouldPaint = false; 
    var pos = this.getMousePos(this.canvas, e);
    let diffX = pos.x - this.pivotX;
    let diffY = pos.y - this.pivotY; 
    this.startX = this.startX + diffX;
    this.startY = this.startY + diffY;
    
  }

  paint(e): void{
    if (!this.shouldPaint){
      return;
    }

    
    
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);

    var pos = this.getMousePos(this.canvas, e);
    let diffX = pos.x - this.pivotX;
    let diffY = pos.y - this.pivotY;

    this.context.strokeStyle="#eeeeee";
    this.context.lineWidth = 1;
    
    for (let i = (this.startX+(diffX%30))%30; i < this.canvas.offsetWidth; i+=30) { 
      this.context.moveTo(i,0);
      this.context.lineTo(i, this.canvas.offsetHeight);
      this.context.stroke()
    }
    for (let i = (this.startY+(diffY%30))%30; i < this.canvas.offsetHeight; i+=30) {
      this.context.moveTo(0,i);
      this.context.lineTo(this.canvas.offsetWidth, i);
      this.context.stroke()
    }

    this.context.beginPath()
    
  }




  
  
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
    
    for (let i = 0; i < this.canvas.offsetWidth; i+=30) { 
      this.context.moveTo(i,0);
      this.context.lineTo(i, this.canvas.offsetHeight);
      this.context.stroke()
    }
    for (let i = 0; i < this.canvas.offsetHeight; i+=30) {
      this.context.moveTo(0,i);
      this.context.lineTo(this.canvas.offsetWidth, i);
      this.context.stroke()
    }
    this.context.beginPath();
    this.context.strokeStyle="#000000";
    this.context.beginPath();
  }


  ngAfterViewInit(){
    this.canvas.addEventListener('mousedown', (e) => {
      this.startPaint(e);
    });
    this.canvas.addEventListener('mouseup', (e) => {
      this.stopPaint(e);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      this.paint(e);
    })
    this.paintGrid();
  }


}











