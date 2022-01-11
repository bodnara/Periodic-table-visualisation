import {Component, Input, OnInit} from '@angular/core';
import {Element} from '../Element';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.css']
})
export class PeriodicTableComponent implements OnInit {
  @Input()
  elements: Element[] = [];
  @Input()
  selection: SelectionModel<Element> = new SelectionModel<Element>(true, []);

  baseElements: Element[];
  separatedElements: Element[];

  rows = Array.from({length: 7}, (_, i) => i + 1);
  columns = Array.from({length: 18}, (_, i) => i + 1);

  uniqueGroupBlocks: Set<string>;

  constructor() {
  }

  ngOnInit(): void {
    const groupBlocks = this.elements.map(e => e.groupBlock);
    this.uniqueGroupBlocks = new Set<string>(...[groupBlocks.sort()]);

    this.baseElements = [this.elements[0]]
      .concat([null].concat(this.groupBlocksAsElements(this.uniqueGroupBlocks)).concat([null, null, null, null]))
      .concat(this.elements.slice(1, 4))
      .concat(Array.from({length: 10}, () => null))
      .concat(this.elements.slice(4, 12))
      .concat(Array.from({length: 10}, () => null))
      .concat(this.elements.slice(12, 56))
      .concat([{name: 'Lanthanoids', symbol: '57-71', groupBlock: 'lanthanoid', atomicNumber: -1}])
      .concat(this.elements.slice(71, 88))
      .concat([{name: 'Actinoids', symbol: '89-103', groupBlock: 'actinoid', atomicNumber: -1}])
      .concat(this.elements.slice(103, 118));
    this.separatedElements = this.elements.slice(56, 71).concat(this.elements.slice(88, 103));

    this.elements = this.baseElements.concat(this.separatedElements);

    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i]) {
        if (this.isSeparated(this.elements[i])) {
          this.elements[i].group = -1;
        } else {
          this.elements[i].period =  Math.floor(i / this.columns.length) + 1;
        }
      }
    }

    this.selection.select(...this.elements);
  }

  resetSelection(): void {
    this.selection.clear();
    this.selection.select(...this.elements);
  }

  select(index: number, indicator: string): void {
    const elems = [];
    this.elements.forEach(e => {
      if (e && e[indicator] === index) {
        elems.push(e);
      }
    });

    this.selectElements(elems);
  }

  selectElements(elems: Element[]): void {
    if (!elems[0]){
      return;
    }

    if (elems.length === 1 && this.uniqueGroupBlocks.has(elems[0].name.replace(/ /g, '-'))) {
      const groupBlock = elems[0].name.replace(/ /g, '-');
      elems = this.elements.filter(e => e && e.atomicNumber !== -1 && e.groupBlock === groupBlock);
    }

    if (this.allSelected(this.elements)) {
      this.selection.clear();
      this.selection.select(...elems);
    } else if (this.allSelected(elems)) {
      this.selection.deselect(...elems);
    } else {
      this.selection.select(...elems);
    }

    if (this.selection.selected.length === 0) {
      this.selection.select(...this.elements);
    }
  }

  allSelected(elems: Element[]): boolean {
    return elems.reduce((acc, e) => acc && (!e || this.selection.isSelected(e)), true);
  }

  isSeparated(e: Element): boolean{
    return e.groupBlock === 'lanthanoid' || e.groupBlock === 'actinoid';
  }

  private groupBlocksAsElements(uniqueGroupBlocks: Set<string>): Element[] {
    const elems: Element[] = [];
    uniqueGroupBlocks.forEach(block => {
      elems.push({name: block.replace(/-/g, ' '), symbol: '', atomicNumber: 0, groupBlock: block});
    });

    return elems;
  }
}
