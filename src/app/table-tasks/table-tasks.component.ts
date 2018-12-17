import { Component } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { CdkDragDrop, CdkDropListContainer } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-table-tasks',
  templateUrl: './table-tasks.component.html',
  styleUrls: ['./table-tasks.component.css']
})

/**
 * @author Mattia La Spina <mattiaa95@gmail.com>
 */
export class TableTasksComponent {

  /**
  * You can select a colum hour by this var "hours".
  */
  hours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ]

  /**
  * You can select a tasker ans task by this variable "taskers".
  */
  taskers: Array<any> = [
    {
      name: 'Maria', tasks: [
        { id: '0001', type: 'Tarea Maria', start: '10:00', end: '10:30' },
        { id: '0002', type: 'Descanso', start: '11:30', end: '12:30' }
      ]
    },
    {
      name: 'Pablo', tasks: [
        { id: '0003', type: 'Tarea Pablo', start: '13:00', end: '16:30' }
      ]
    },
    {
      name: 'Jesus', tasks: [
        { id: '0004', type: 'Tarea Jesus', start: '15:00', end: '18:30' },
        { id: '0005', type: 'Descanso', start: '11:00', end: '12:30' }
      ]
    },
    {
      name: 'Mario', tasks: [
        { id: '0006', type: 'Tarea Mario', start: '14:00', end: '18:30' },
        { id: '0007', type: 'Descanso', start: '10:30', end: '12:30' }
      ]
    },
    {
      name: 'Nacho', tasks: [
        { id: '0008', type: 'Tarea Nacho', start: '11:00', end: '17:30' },
        { id: '0009', type: 'Descanso', start: '19:00', end: '20:00' }
      ]
    }

  ]

  /**
  * this Variable "taskersLastDrop" is needed if the drop is invalid to restore last informations.
  */
  taskersLastDrop: Array<any> = JSON.parse(JSON.stringify(this.taskers));

  /**
   * Method return index of Tasker by name.
   * @param taskersName Tasker name you want to search.
   * @returns       Return number of index.
   */
  findTaskersIdexByName(taskersName: string) {
    return this.taskers.findIndex(x => x.name == taskersName);
  }

  /**
   * Method return index of Hour by value String.
   * @param hour Hour name you want to search.
   * @returns       Return number of index.
   */
  findHoursIndexByHour(hour: string) {
    return this.hours.findIndex(x => x == hour);
  }

  /**
  * Method return name of Tasker extract by event.
  * @param event Event from drop function.
  * @param previus Boolean to select previus container or actual container in event.
  * @returns       Return string name of Tasker.
  */
  extractNameTaskersFromEvent(event: CdkDragDrop<string[]>, previus: boolean) {
    let container: CdkDropListContainer<any>;
    if (previus) {
      container = event.previousContainer;
    } else {
      container = event.container;
    }
    return container.id.substr(5, event.previousContainer.id.length);
  }

  /**
   * Method return index of Task by id value String.
   * @param id Id you want to search.
   * @returns       Return number of index.
   */
  findIndexTaskById(id: number) {
    return this.taskers.findIndex(x => x.id == id);
  }

  /**
    * Method changes in the data array the hours when the event happens.
    * @param actualTaskersDraggingTask the selected task that was moved
    * @param hour Destination time where it moved
    */
  setHourToTaskFromTaskers(actualTaskersDraggingTask: any, hour: string) {
    let indxStart = this.findHoursIndexByHour(actualTaskersDraggingTask.start);
    let newStart = this.findHoursIndexByHour(hour);
    let indxEnd = this.findHoursIndexByHour(actualTaskersDraggingTask.end);

    actualTaskersDraggingTask.end = this.hours[indxEnd + (newStart - indxStart)];
    actualTaskersDraggingTask.start = hour;
  }

  /**
  * Method that does not overlap tasks in the same hours
  * @param dropTaskersContainerTasks Moved container
  * @returns       Return true if there are duplicate hours or they are outside the limit
  */
  getHoursOfTaskersTasks(dropTaskersContainerTasks: [any]) {
    let tasksHoursOcuped = [];
    let duplicatedOrBadDragged = false;

    dropTaskersContainerTasks.forEach(element => {
      let indxStart = this.findHoursIndexByHour(element.start);
      let indxEnd = this.findHoursIndexByHour(element.end);
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

  /**
  * Method return a array with the duplicated objects.
  * @param array Array you want to find duplicated objects.
  * @returns       Return array with the duplicated objects.
  */
  findFuplicateInArray(array) {
    let object = {};
    let result = [];

    array.forEach(function (item) {
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

  /**
   * Method call when drop any task
   * @param event object that resulted from the event of drop.
   */
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

  /**
   * Method call when Resize any task
   * @param event object that resulted from the event of Resize.
   */
  onResizeEnd(event: ResizeEvent, id: any): void {
    console.log('Element was resized', event);
    console.log(event.rectangle.height);
    console.log(id);
    //TODO: take Height from event(event.rectangle.height) and apply to style with the this.setMyStylesHeight() style
  }

  /**
   * Method set style to resizing the DIVS of Tasks
   * @param start The start hour of task.
   * @param end The end hour of task.
   */
  setMyStylesHeight(start, end) {//resize onload tasks
    let indxStart = this.findHoursIndexByHour(start);
    let indxEnd = this.findHoursIndexByHour(end);
    let pixels = ((indxEnd - indxStart + 1) * 34) - 4;
    let styles = {
      'height': pixels + 'px'
    };
    return styles;
  }

}

