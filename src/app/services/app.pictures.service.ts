import { Injectable } from '@angular/core';

interface Picture {
    id: string
    author: string
    width: string
    height: string
    url: string
    download_url: string
}

@Injectable({
	providedIn: 'root'
})
export class PictureService {
  private readonly url = 'https://picsum.photos/v2/list/';

	private page = 1;
	private limit = 10;

	async getPhotos(): Promise<Picture[]> {
    const response = await fetch(`${this.url}?page=${this.page}&limit=${this.limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async simulateSearching(): Promise<Picture[]> {
    const response = await fetch(`${this.url}?page=${(Math.random() * 10).toFixed(0)}&limit=${this.limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
	nextPage() {
		this.page++;
    return this.page;
	}
}