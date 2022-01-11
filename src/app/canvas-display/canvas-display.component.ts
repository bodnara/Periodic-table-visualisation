import {Component, Input, OnInit} from '@angular/core';
import {ChartDataSets, ChartType} from 'chart.js';
import {Element} from '../Element';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-canvas-display',
  templateUrl: './canvas-display.component.html',
  styleUrls: ['./canvas-display.component.css']
})
export class CanvasDisplayComponent implements OnInit {
  @Input()
  selection: SelectionModel<Element> = new SelectionModel<Element>(true, []);

  chartTypes: ChartType[] = ['bar', 'line', 'doughnut'];
  selectedType: string = this.chartTypes[0];

  propertiesPerChartType: Map<string, string[]> = new Map<string, string[]>([
    ['bar', ['atomicMass', 'atomicNumber', 'atomicRadius', 'boilingPoint', 'density',
      'electronAffinity', 'ionizationEnergy', 'meltingPoint', 'vanDerWaalsRadius']],
    ['line', ['yearDiscovered']],
    ['doughnut', ['standardState']]
  ]);
  selectedProperty: string[] = this.propertiesPerChartType.get(this.selectedType);

  data: ChartDataSets[] = [];
  chartOptions = {
    scaleShowVerticalLine: false,
    responsive: true
  };
  labels = [];

  constructor() {
  }

  ngOnInit(): void {
    this.refresh();

    this.selection.changed.subscribe(() => {
      this.refresh();
    });
  }

  filterData(): Element[] {
    return this.selection.selected.filter(e => !!e && e.atomicNumber > 0).sort((a, b) => {
      if (a.atomicNumber < b.atomicNumber) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  parseData(elems: Element[], prop: string): any {
    return elems.map(e => {
      if (e && e[prop]) {
        return e[prop];
      }
    });
  }

  getUniquePropertyValues(elems: Element[], prop: string): any {
    return Array.from(new Set(...[elems.map(e => e[prop])]));
  }

  setLineData(elems: Element[]): void {
    // Line chart is only defined for year discovered property
    elems = elems.sort((a, b) => {
      if (a[this.selectedProperty[0]] === 'Ancient'){
        return -1;
      } else if (b[this.selectedProperty[0]] === 'Ancient') {
        return 1;
      } else {
        return a[this.selectedProperty[0]] - b[this.selectedProperty[0]];
      }
    });

    this.data.push({data: this.parseData(elems, this.selectedProperty[0]), label: this.selectedProperty[0]});
    this.labels = elems.map(e => e.name);
  }

  setBarData(elems: Element[], show: Set<string>): void {
    this.selectedProperty.forEach(prop => {
      this.data.push({data: this.parseData(elems, prop), label: prop, hidden: !show.has(prop)});
    });
    this.labels = elems.map(e => e.name);
  }

  setDoughnutData(elems: Element[]): void {
    const groupNames = this.getUniquePropertyValues(elems, this.selectedProperty[0]);
    const count: number[] = [];
    groupNames.forEach(group => {
      const filtered = this.parseData(elems.filter(e => e[this.selectedProperty[0]] === group), this.selectedProperty[0]);
      count.push(filtered.length);
    });
    this.data.push({data: count, label: this.selectedProperty[0]});
    this.labels = groupNames;
  }


  refresh(): void {
    const elems = this.filterData();
    let show: Set<string> = new Set<string>([this.selectedProperty[0]]);
    if (this.data.length !== 0) {
      show = new Set<string>(...[this.data.filter(dataset => !dataset.hidden).map(dataset => dataset.label)]);
    }
    this.data = [];

    switch (this.selectedType) {
      case 'bar': {
        this.setBarData(elems, show);
        break;
      }
      case 'line': {
        this.setLineData(elems);
        break;
      }
      case 'doughnut': {
        this.setDoughnutData(elems);
        break;
      }
      default: this.setBarData(elems, show);
    }
  }

  changeCharType(): void {
    this.selectedProperty = this.propertiesPerChartType.get(this.selectedType);

    // hack to make chart update properly
    const e = this.selection.selected[0];
    this.selection.deselect(e);
    this.selection.select(e);
  }
}
