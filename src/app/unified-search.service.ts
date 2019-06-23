import { Injectable } from '@angular/core';
import { Observable, forkJoin, concat, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { UnifiedSearch } from './unified-search';
import { GitSearchService } from './git-search.service';
import { GitCodeSearchService } from './git-code-search.service';
import { GitSearch } from './git-search';
import { GitCodeSearch } from './git-code-search';

@Injectable({
  providedIn: 'root'
})
export class UnifiedSearchService {

  constructor(private searchService: GitSearchService, private codeSearchService: GitCodeSearchService) { }

  unifiedSearch = (query: string): Observable<UnifiedSearch> => {
    return forkJoin(this.searchService.gitSearch(query, '1'), this.codeSearchService.codeSearch(query))
                .pipe(map((response) => ({repositories: response[0], code: response[1]})
           ));

  }
}
