import { Injectable } from '@angular/core';
import { GitSearch } from './git-search';
import { UserSearch } from './user-search';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// import 'rxjs';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GitSearchService {

  cashedValues: Array<{ [query: string]: GitSearch }> = [];

  constructor(private http: HttpClient) { }

  gitSearch(query: string, page: string): Observable<GitSearch> {
    return this.http.get<GitSearch>('https://api.github.com/search/repositories?q=' + query + '&page=' + page);
  }

  getLastPage(query: string, page: string): Observable<HttpResponse<object>> {
    return this.http.get<object>('https://api.github.com/search/repositories?q=' + query + '&page=' + page, { observe: 'response' });
  }

  userSearch(user: string): Observable<UserSearch> {
    return this.http.get('https://api.github.com/search/users?q=' + user) as Observable<UserSearch>;
  }

  // gitSearch = (query: string) => {
  //   // if(this.cashedValues[query]){ return Observable.create(query); }
  //   this.http.get('https://api.github.com/search/repositories?q=' + query);
  // }
    // let promise = new Promise<GitSearch>((resolve, reject) => {

    //   if (this.cashedValues[query]) {
    //     resolve(this.cashedValues[query]);
    //   } else {
    //     this.http.get('https://api.github.com/search/repositories?q=' + query)
    //              .toPromise()
    //              .then((response) => { resolve(response as GitSearch); }, (error) => { reject(error); });
    //   }
    // });
    // return promise;
  // }
}
