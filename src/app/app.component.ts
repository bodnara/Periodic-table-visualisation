import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Element } from './Element';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  loading = false;
  elements: Element[] = [];
  selection: SelectionModel<Element> = new SelectionModel<Element>(true, []);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    this.http.get('https://periodic-table-elements-info.herokuapp.com/elements').subscribe(elements => {
      const elems = elements as Element[];
      elems.forEach(e => {
        e.groupBlock = e.groupBlock.replace(/ /g, '-');
        e.atomicMass = Number(e.atomicMass.toString().slice(0, 5));
        if (e.name === 'Lawrencium') {
          e.groupBlock = 'actinoid';
        }
      });

      this.elements = elems;
      this.loading = false;
    });
  }
}
