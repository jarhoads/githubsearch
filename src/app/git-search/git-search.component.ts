import { Component, OnInit } from '@angular/core';

import { GitSearchService } from '../git-search.service';
import { GitSearch } from '../git-search';

@Component({
  selector: 'app-git-search',
  templateUrl: './git-search.component.html',
  styleUrls: ['./git-search.component.css']
})
export class GitSearchComponent implements OnInit {

  searchResults: GitSearch;
  searchQuery: string;

  constructor(private gitSearchService: GitSearchService) { }

  ngOnInit() {
    this.gitSearchService.gitSearch('angular')
                   .subscribe((response) => this.searchResults = response,
                              (error) => console.log(`Error: ${error.statusText}`));
  }

  gitSearch = () => {
    this.gitSearchService.gitSearch(this.searchQuery)
                         .subscribe((response) => this.searchResults = response,
                                    (error) => console.log(`Error: ${error.statusText}`));
  }

}
