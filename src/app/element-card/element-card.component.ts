import {Component, Input} from '@angular/core';
import {Element} from '../Element';

@Component({
  selector: 'app-element-card',
  templateUrl: './element-card.component.html',
  styleUrls: ['./element-card.component.css']
})
export class ElementCardComponent {

  constructor() { }

  @Input()
  element: Element;
  @Input()
  selected = true;

}
