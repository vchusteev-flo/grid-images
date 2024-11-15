import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { PictureService } from '../services/app.pictures.service';

export interface Picture {
	author: string;
  download_url: string;
  id: string;
  url: string;
  width: string;
  height: string;
}

export interface PicturesStateModel {
	pictures: Picture[],
	source: 'load' | 'search',
	page: number,
	isLoading: boolean,
}

export class LoadMorePictures {
	static readonly type = '[Pictures] Load More'
}
export class SimulateSearching {
	static readonly type = '[Pictures] Simulate Searching'
}

@State<PicturesStateModel>({
	name: 'pictures',
	defaults: {
		pictures: [],
		source: 'load',
		isLoading: false,
		page: 1,
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

		const pictures = await this.pictureService.getPhotos()

		ctx.patchState({
			pictures: [...state.pictures, ...pictures],
			isLoading: false,
			source: 'load',
			page: state.page + 1
		})
		this.pictureService.nextPage()
	}

  @Action(SimulateSearching)
	async simulateSearching(ctx: StateContext<PicturesStateModel>) {
		const state = ctx.getState();
		ctx.patchState({isLoading: true})
		const pictures = await this.pictureService.simulateSearching();
		ctx.patchState({
			pictures: pictures,
			isLoading: false,
			source: 'search',
			page: state.page + 1
		})
		this.pictureService.nextPage();
	}
}
