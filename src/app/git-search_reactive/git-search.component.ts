import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GitSearchService } from '../git-search.service';
import { GitSearch } from '../git-search';

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

  form: FormGroup;
  formControls = {};

  constructor(private gitSearchService: GitSearchService,
              private route: ActivatedRoute,
              private router: Router) {

                this.modelKeys.forEach( (key) => {
                  const validators = [];

                  if (key === 'q') { validators.push(Validators.required); }
                  if (key === 'stars') { validators.push(Validators.maxLength(4)); }
                  validators.push(this.noSpecialChars);

                  this.formControls[key] = new FormControl(this.model[key], validators);
                });

                this.form = new FormGroup(this.formControls);
              }

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

  noSpecialChars(c: FormControl) {
    const REGEXP = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);

    return REGEXP.test(c.value) ? { validateEmail: { valid: false } } : null;
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
    const search: string = this.form.value.q;
    let params = '';

    this.modelKeys.forEach((elem) => {
      if (elem === 'q') { return false; }
      if (this.form.value.elem) { params += '+' + elem + ':' + this.form.value.elem; }
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
