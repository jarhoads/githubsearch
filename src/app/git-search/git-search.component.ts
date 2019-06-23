import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GitSearchService } from '../git-search.service';
import { UnifiedSearchService } from '../unified-search.service';
import { GitSearch } from '../git-search';
import { AdvancedSearchModel } from '../advanced-search-model';
import { SearchFormGroup } from '../search-form-group';
import { UnifiedSearch } from '../unified-search';

@Component({
  selector: 'app-git-search',
  templateUrl: './git-search.component.html',
  styleUrls: ['./git-search.component.css']
})
export class GitSearchComponent implements OnInit {

  searchResults: UnifiedSearch;
  searchQuery: string;
  searchPage: string;
  searchNextPage: string;
  title: string;
  displayQuery: string;
  displayPage: string;
  totalPages: number;
  favorites: Array<number> = [];

  model = new AdvancedSearchModel('', '', '', null, null, '');
  modelKeys = Object.keys(this.model); // convert keys of object to array

  form: SearchFormGroup;
  formControls = {};

  constructor(private unifiedService: UnifiedSearchService,
              private gitSearchService: GitSearchService,
              private route: ActivatedRoute,
              private router: Router) {
                this.form = new SearchFormGroup(this.modelKeys);
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

  checkType = (key) => {
    return typeof key === 'string' ? 'text' : typeof key;
  }

  handleFavorite = (id) => {
    if (this.favorites.includes(id)) {
      return this.removeByID(id);
    } else {
      return this.favorites.push(id);
    }
  }

  private removeByID(id: number): number[] {
    return this.favorites.splice(this.locateId(id), 1);
  }

  private locateId = (id: number) => this.favorites.indexOf(id);

  gitSearch = () => {
    // this.unifiedService.unifiedSearch(this.searchQuery, this.searchPage)
    this.unifiedService.unifiedSearch(this.searchQuery)
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
