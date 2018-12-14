import { Component } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { CdkDragDrop, CdkDropListContainer } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-table-tasks',
  templateUrl: './table-tasks.component.html',
  styleUrls: ['./table-tasks.component.css']
})
export class TableTasksComponent {

  hours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ]

  taskers: Array<any> = [
    {
      name: 'Mariano', tasks: [
        { id: '1212', type: 'Tarea trueno', start: '10:00', end: '10:30' },
        { id: '142', type: 'Tarea potente', start: '11:30', end: '12:30' }
      ]
    },
    {
      name: 'Pablo', tasks: [
        { id: '1244', type: 'Tarea destrozador', start: '13:00', end: '16:30' }
      ]
    },
    {
      name: 'Rajoy', tasks: [
        { id: '1992', type: 'Tarea chungo', start: '15:00', end: '18:30' },
        { id: '4545', type: 'Tarea', start: '11:00', end: '12:30' }
      ]
    },
    {
      name: 'Iglesias', tasks: [
        { id: '1992', type: 'Tarea chungo', start: '14:00', end: '18:30' },
        { id: '4545', type: 'Descanso', start: '10:30', end: '12:30' }
      ]
    },
    {
      name: 'Nacho', tasks: [
        { id: '1992', type: 'Tarea chungo', start: '11:00', end: '17:30' },
        { id: '4545', type: 'Tarea', start: '19:00', end: '20:00' }
      ]
    }

  ]

  taskersLastDrop: Array<any> = JSON.parse(JSON.stringify(this.taskers));

  findTaskersIdexByName(therapistName: string) {
    return this.taskers.findIndex(x => x.name == therapistName);
  }

  findHoursIndesByHour(hour: string) {
    return this.hours.findIndex(x => x == hour);
  }

  extractNameTaskersFromEvent(event: CdkDragDrop<string[]>, previus: boolean) {
    let container: CdkDropListContainer<any>;
    if (previus) {
      container = event.previousContainer;
    } else {
      container = event.container;
    }
    return container.id.substr(5, event.previousContainer.id.length);
  }

  findIndexTaskById(id: number) {
    return this.taskers.findIndex(x => x.id == id);
  }

  setHourToTaskFromTaskers(actualTaskersDraggingTask: any, hour: string) {
    let indxStart = this.findHoursIndesByHour(actualTaskersDraggingTask.start);
    let newStart = this.findHoursIndesByHour(hour);
    let indxEnd = this.findHoursIndesByHour(actualTaskersDraggingTask.end);

    actualTaskersDraggingTask.end = this.hours[indxEnd + (newStart - indxStart)];
    actualTaskersDraggingTask.start = hour;
  }

  getHoursOfTaskersTasks(dropTaskersContainerTasks: [any]) {
    let tasksHoursOcuped = [];
    let duplicatedOrBadDragged = false;

    dropTaskersContainerTasks.forEach(element => {
      let indxStart = this.findHoursIndesByHour(element.start);
      let indxEnd = this.findHoursIndesByHour(element.end);
      if (indxEnd == -1) {
        duplicatedOrBadDragged = true;
      }
      for (indxStart; indxStart <= indxEnd; indxStart++) {
        tasksHoursOcuped.push(indxStart);
      }
    });
    if (this.findFuplicateInArray(tasksHoursOcuped).length > 0) {
      duplicatedOrBadDragged = true;
    }
    return duplicatedOrBadDragged;
  }

  findFuplicateInArray(arra1) {
    let object = {};
    let result = [];

    arra1.forEach(function (item) {
      if (!object[item])
        object[item] = 0;
      object[item] += 1;
    })

    for (let prop in object) {
      if (object[prop] >= 2) {
        result.push(prop);
      }
    }
    return result;
  }

  drop(event: CdkDragDrop<string[]>) {
    const actualTaskersDragging = this.taskers[this.findTaskersIdexByName(this.extractNameTaskersFromEvent(event, true))];
    const dropTaskersContainer = this.taskers[this.findTaskersIdexByName(this.extractNameTaskersFromEvent(event, false))];
    const indexOfDraggingTask = actualTaskersDragging.tasks.findIndex(x => x.id == event.item.element.nativeElement.id);
    const taskDragging = actualTaskersDragging.tasks[indexOfDraggingTask];
    const hourOfContainer = event.container.id.substr(0, 5);
    //-----------Cambiamos terapeutas con los datos del darg and drop-------------
    this.setHourToTaskFromTaskers(taskDragging, hourOfContainer);
    actualTaskersDragging.tasks.splice(indexOfDraggingTask, 1)
    dropTaskersContainer.tasks.push(taskDragging);
    //-----------Revisamos que todo este bien , y sino volvemos a la variable de intercambio de antes de cambiar datos.-------------------
    if (this.getHoursOfTaskersTasks(dropTaskersContainer.tasks)) {
      console.log("dupli");
      this.taskers = JSON.parse(JSON.stringify(this.taskersLastDrop));
    }
    //----------Copia del objeto de terapeutas por si el proximo movimeinto es invalido---------------------
    this.taskersLastDrop = JSON.parse(JSON.stringify(this.taskers));
  }

  onResizeEnd(event: ResizeEvent, id: any): void {//resizing method when resize you can get the 
    console.log('Element was resized', event);
    console.log(event.rectangle.height);
    console.log(id);
  }

  setMyStyles(start, end) {//resize onload tasks
    let indxStart = this.findHoursIndesByHour(start);
    let indxEnd = this.findHoursIndesByHour(end);
    let pixels = ((indxEnd - indxStart + 1) * 34) - 4;
    let styles = {
      'height': pixels + 'px'
    };
    return styles;
  }

}

