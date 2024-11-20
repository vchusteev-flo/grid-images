import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { PictureService } from '../services/app.pictures.service';

// export interface Picture {
// 	author: string;
//   download_url: string;
//   id: string;
//   url: string;
//   width: string;
//   height: string;
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

type Source = 'load' | 'search'
export interface PicturesStateModel {
	pictures: Photo[],
	source: Source,
	page: number,
	isLoading: boolean,
	query: string,
}

export class LoadMorePictures {
	static readonly type = '[Pictures] Load More'
}

export class SearchPictures {
	static readonly type = '[Pictures] Search'
	constructor(public query: string) {}
}

@State<PicturesStateModel>({
	name: 'pictures',
	defaults: {
		pictures: [],
		source: 'load',
		isLoading: false,
		page: 1,
		query: '',
	}
})

@Injectable({
	providedIn: 'root'
})

export class PicturesState {
	constructor(private pictureService: PictureService) {}
	@Action(LoadMorePictures)
	async loadMore(ctx: StateContext<PicturesStateModel>) {
		const state = ctx.getState();
		if (state.isLoading) return;

		ctx.patchState({isLoading: true})
		const pictures = await this.pictureService.getPhotos(state.query)

		ctx.patchState({
			pictures: [...state.pictures, ...pictures],
			isLoading: false,
			page: state.page + 1
		})
		// this.pictureService.nextPage()
	}
	@Action(SearchPictures)
	async search(ctx: StateContext<PicturesStateModel>, action: SearchPictures ) {
		const state = ctx.getState();
		if (state.isLoading) return;
		ctx.patchState({
			pictures: [],
			page: 1,
			query: action.query,
			source: 'search',
			isLoading: true,
		})
		const pictures = await this.pictureService.getPhotos(action.query)

		ctx.patchState({
			pictures: pictures,
			isLoading: false,
		})
	}
}