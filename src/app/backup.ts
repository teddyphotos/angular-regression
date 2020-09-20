// BACKUP FILE FOR app.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Linear Regression';
  myModel = 5;
  
  



  ngOnInit(){
    
    
  }

  clearGraph(): void{
    var canvas =  document.querySelector('canvas');
    var context = canvas.getContext('2d');
    context.clearRect(0,0, canvas.width, canvas.height);
  }

 

  

  ngAfterViewInit(){
    var thickness = this.myModel;
    
    var canvas =  document.querySelector('canvas');
    console.log(canvas);
    var graph_container = document.getElementById("graph-container");
    canvas.width = graph_container.offsetWidth;
    canvas.height = graph_container.offsetHeight;

    var context = canvas.getContext('2d');
    let shouldPaint = false;

    function startPaint(e){
      shouldPaint = true;
      paint(e);
    }

    function stopPaint(){
      shouldPaint = false;
      context.beginPath()
    }

    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    
    function paint(e){
      if (!shouldPaint){
        return;
      }
      

      var pos = getMousePos(canvas, e);
      
      context.lineWidth = thickness;
      context.lineCap = 'round';
      context.lineTo(pos.x, pos.y);
      context.stroke()

      context.beginPath();
      context.moveTo(pos.x, pos.y);

    }

    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mouseup', stopPaint);
    canvas.addEventListener('mousemove', paint)

    



  }


}





function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("floating-nav").style.top = "0px";
      if(currentScrollPos<=32){
        document.getElementById("floating-nav").style.color = "#000000";
        document.getElementById("floating-nav").style.top = "-64px";
      }
    } else {
        document.getElementById("floating-nav").style.color = "#000000";
        document.getElementById("floating-nav").style.top = "-64px";
    }
    prevScrollpos = currentScrollPos;
    
}





