import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';
import { environment } from './../environments/environment';

import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusicDataService {

  constructor(private spotifyToken: SpotifyTokenService, private http: HttpClient) { }  

  favouritesList: Array<any> = [];

  getNewReleases(): Observable<SpotifyApi.ListOfNewReleasesResponse> {
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
        return this.http.get<SpotifyApi.ListOfNewReleasesResponse>("https://api.spotify.com/v1/browse/new-releases", { headers: { "Authorization": `Bearer ${token}` } });
      }));
  }

  getArtistById(id: string): Observable<SpotifyApi.SingleArtistResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.SingleArtistResponse>(`https://api.spotify.com/v1/artists/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }

  getAlbumsByArtistId(id: string): Observable<SpotifyApi.ArtistsAlbumsResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      // NOTE: Important to include the query parameters include_groups and limit here, to show the maximum amount of albums on one page
      return this.http.get<SpotifyApi.ArtistsAlbumsResponse>(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`, { headers: { "Authorization": `Bearer ${token}` } })
    })); 
  }

  getAlbumById(id: string): Observable<SpotifyApi.SingleAlbumResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.SingleAlbumResponse>(`https://api.spotify.com/v1/albums/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
    })); 
  }

  searchArtists(searchString: string): Observable<SpotifyApi.ArtistSearchResponse>{
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.ArtistSearchResponse>(`https://api.spotify.com/v1/search?q=${searchString}&type=artist&limit=50`, { headers: { "Authorization": `Bearer ${token}` } })
    })); 
  }

  // addToFavourites(id:string): Observable<[String]> {
  //   // TODO: make a PUT request to environment.userAPIBase/favourites/:id to add id to favourites
  //   return this.http.put<[String]>(environment.userAPIBase + "/favourites/" + id, {});
  // }

  addToFavourites(id:string): boolean{
    if(id && this.favouritesList.length < 50){
      this.favouritesList.push(id);
      return true;
    }else{
      return false;
    }
  }

  // removeFromFavourites(id:string): Observable<any> {
  //   return this.http.delete<[String]>(`${environment.userAPIBase}/favourites/${id}`).pipe(mergeMap(favouritesArray => {
  //     let indexOfId = favouritesArray.indexOf(id);
  //     if(indexOfId > -1){
  //       favouritesArray.splice(indexOfId, 1);
  //     }
  //     return favouritesArray;
  //   }));
  // }
  removeFromFavourites(id:string): Observable<any>{
    let indexOfId = this.favouritesList.indexOf(id);
    if (indexOfId > -1) {
      this.favouritesList.splice(indexOfId, 1);
    }
    return this.getFavourites();
    
  }

  // getFavourites(): Observable<any> {
  //   return this.http.get<[String]>(`${environment.userAPIBase}/favourites/`).pipe(mergeMap(favouritesArray => {
  //     if (favouritesArray.length > 0){
  //       console.log("test");
  //       return favouritesArray;
  //     }
  //     else{
  //       console.log("test2");
  //       return new Observable(o=>o.next({tracks: []}));
  //     }
  //   }));
  // }

  getFavourites(): Observable<any>{
    if(this.favouritesList.length > 0){
      return this.http.get<any>(environment.userAPIBase + "/favourites")

    }else{
      return new Observable(o=>{o.next([])});
    }  
  }
}