import { Component, OnDestroy, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-album-component',
  templateUrl: './album-component.component.html',
  styleUrls: ['./album-component.component.css']
})

export class AlbumComponentComponent implements OnInit, OnDestroy {

  album: any;
  private albumSub: Subscription | undefined;
  private routeSub: Subscription | undefined;

  constructor(private musicData: MusicDataService, private route: ActivatedRoute, private snackBar: MatSnackBar) { }
//
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.albumSub = this.musicData.getAlbumById(params['id']).subscribe(data => {
        this.album = data;
      });
    });

  }

  // TODO: THIS HAS TO BE CHANGED TO SUBSCRIBE 
  addToFavourites(id: string) {
    if (this.musicData.addToFavourites(id)) {
      this.snackBar.open("Adding to Favourites...", "Done", { duration: 1500 })
    };
  }

  // addToFavourites in album.component.ts
  // addToFavourites(id: string){
  //   this.musicData.addToFavourites(id).subscribe(
  //     response => {
  //       this.snackBar.open("Adding to Favourites...", "Done", { duration: 1500 });
  //     },
  //     error => {
  //       console.log(error.message);
  //     }
  //   )
  // }

  ngOnDestroy(): void{
    this.albumSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }
}

