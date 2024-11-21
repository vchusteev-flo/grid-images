import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

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
  private readonly limit = 10;

  constructor(private store: Store) {}

	async getPhotos(query: string): Promise<Photo[]> {
    const state = this.store.selectSnapshot(state => state.pictures);

    const url = query 
    ? `${this.url}?query=${query}&page=${state.page}&limit=${this.limit}`
    : `${this.url}?page=${state.page}&limit=${this.limit}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data ? result.data : [];
  }
}