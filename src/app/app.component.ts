import { Component, OnInit } from '@angular/core';
import { GitSearchService } from './git-search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Github Browser';

  constructor(private gitService: GitSearchService) { }

  ngOnInit() {
    this.gitService.getGitSearch('angular')
                   .subscribe((response) => console.log(`Total Libraries Found: ${response.total_count}`),
                              (error) => console.log(`Error: ${error.statusText}`));
    this.gitService.userSearch('tom')
                   .subscribe((response) => console.log(`Total Libraries Found: ${response.total_count}`),
                              (error) => console.log(`Error: ${error.statusText}`));
    // this.gitService.gitSearch('angular')
    //                .then( (response) => console.log(`Total Libraries Found: ${response.total_count}`),
    //                       (error) => console.log(`Error: ${error.statusText}`) );
  }
}
