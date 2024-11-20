import { Injectable } from '@angular/core';

// interface Picture {
//     id: string
//     author: string
//     width: string
//     height: string
//     url: string
//     download_url: string
// }

type Photo = {
  id: number;
  width: number;
  height: number;
  urls: { large: string; regular: string; raw: string; small: string };
  color: string | null;
  user: {
    username: string;
    name: string;
  };
};

@Injectable({
	providedIn: 'root'
})
export class PictureService {
  private readonly url = 'https://j8dwmmnd71.execute-api.us-east-1.amazonaws.com/';

	private page = 1;
	private limit = 10;

	async getPhotos(): Promise<Photo[]> {
    const response = await fetch(`${this.url}?page=${this.page}&limit=${this.limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data ? result.data : [];
  }

  async simulateSearching(query: string): Promise<Photo[]> {
    const response = await fetch(`${this.url}/?query=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result.data)
    return result.data ? result.data : [];
  }
	nextPage() {
		this.page++;
    return this.page;
	}
}