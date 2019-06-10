import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { GitSearchService } from '../git-search.service';
import { GitSearch } from '../git-search';
import { HttpResponse } from '@angular/common/http';
import { AdvancedSearchModel } from '../advanced-search-model';

@Component({
  selector: 'app-git-search',
  templateUrl: './git-search.component.html',
  styleUrls: ['./git-search.component.css']
})
export class GitSearchComponent implements OnInit {

  searchResults: GitSearch;
  searchQuery: string;
  searchPage: string;
  searchNextPage: string;
  title: string;
  displayQuery: string;
  displayPage: string;
  totalPages: number;

  model = new AdvancedSearchModel('', '', '', null, null, '');
  modelKeys = Object.keys(this.model); // convert keys of object to array

  constructor(private gitSearchService: GitSearchService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.searchQuery = params.get('query');
      this.displayQuery = params.get('query');
      this.searchPage = params.get('page');
      this.displayPage = params.get('page');
      this.gitSearch();
      this.setTotalPages();
    });

    this.route.data.subscribe( (result) => { this.title = result.title; });
  }

  getValidationErrors(state: any, thingName?: string) {
    const thing: string = state.path || thingName;
    const messages: string[] = [];

    if (state.errors) {
      for (const errorName in state.errors) {
        if (!errorName) { messages.push('unknown error'); } else { messages.push(`Error: ${this.validationMessage(errorName)}`); }
      }
    }
    return messages;
  }

  private validationMessage(errName: string) {
    if (errName === 'hasSpecialChars') { return 'Special Characters Not Allowed'; }
    // tslint:disable-next-line:one-line
    else if (errName === 'required') { return 'Must Enter A Value'; }
    // tslint:disable-next-line:one-line
    else if (errName === 'minlength') { return 'Must Enter Correct Number '; }
    // tslint:disable-next-line:one-line
    else if (errName === 'maxlength') { return 'Must Enter Correct Number '; }
    // tslint:disable-next-line:one-line
    else { return errName; }
  }

  gitSearch = () => {
    this.gitSearchService.gitSearch(this.searchQuery, this.searchPage)
                         .subscribe((response) => this.searchResults = response,
                                    (error) => console.log(`Error: ${error.statusText}`));
  }

  setTotalPages = () => {
    // let page = parseInt(this.searchPage, 10);

    this.gitSearchService.getLastPage(this.searchQuery, this.searchPage)
                         .subscribe((response) => {
                            const header = response.headers.get('link');
                            this.totalPages = this.getLastPage(header);
                          },
                          (error) => console.log(`Error: ${error.statusText}`));
  }

  private getLastPage(header: string) {
    const lastPageHeader: string[] = header.split(','); // <https://api.github.com/search/repositories?q=node&page=34>; rel="last"

    if (lastPageHeader[1].includes('rel="last"')) {
      const lastUrl = lastPageHeader[1].split(';'); // <https://api.github.com/search/repositories?q=node&page=34>
      const lastPageString = lastUrl[0].split('page='); // 34>
      return parseInt(lastPageString[1].substring(0, lastPageString[1].indexOf('>')), 10);
    }

    return this.totalPages;
  }

  sendQuery = () => {
    this.searchResults = null;
    const search: string = this.model.q;
    let params = '';

    this.modelKeys.forEach((elem) => {
      if (elem === 'q') { return false; }
      if (this.model[elem]) { params += '+' + elem + ':' + this.model[elem]; }
    });

    this.searchQuery = search;

    if (params !== '') { this.searchQuery = search + '+' + params; }

    this.displayQuery = this.searchQuery;
    this.gitSearch();
    // this.router.navigate([`/search/${this.searchQuery}/1`]);
  }

  nextPage = () => {
    let page = parseInt(this.searchPage, 10) + 1;
    page = (page > this.totalPages) ? 1 : page;
    this.router.navigate([`/search/${this.searchQuery}/${page}`]);
  }

  prevPage = () => {
    let page = parseInt(this.searchPage, 10) - 1;
    page = (page < 1) ? this.totalPages : page;
    this.router.navigate([`/search/${this.searchQuery}/${page}`]);

  }

}
