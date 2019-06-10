import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { GitSearchService } from './git-search.service';
import { GitSearchComponent } from './git-search/git-search.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NoSpecialCharsDirective } from './no-special-chars.directive';

const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'search',
    redirectTo: '/search/angular/1',
    pathMatch: 'full'
  },
  {
    path: 'search/:query/:page',
    component: GitSearchComponent,
    data: { title: 'Git Search' }
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GitSearchComponent,
    HomePageComponent,
    NotFoundComponent,
    NoSpecialCharsDirective
  ],
  imports: [
    BrowserModule,
  // CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [GitSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
