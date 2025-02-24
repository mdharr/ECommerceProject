import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  doSearch(value: string) {
    console.log(`value=${value}`);
		const sanitized = this.sanitizeQuery(value);
		console.log(sanitized);
		if (sanitized.length > 0) {
			this.router.navigateByUrl(`/search/${sanitized}`);
		}
  }

	sanitizeQuery(query: string) {
		return query.trim();
	}

}
