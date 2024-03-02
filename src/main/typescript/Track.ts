export interface ITrack {
    id: string;
    name: string;
    artists: IArtist[];
}

export interface IArtist {
    name: string;
}

export interface IAudioFeatures {
    tempo: number;
    key: number;
    mode: number;
    acousticness: number;
    danceability: number;
    energy: number;
    liveness: number;
    speechiness: number;
    valence: number;
}

export class Track {
    id: string;
    name: string;
    artists: IArtist[];
    audioFeatures: IAudioFeatures;
    
    constructor(track: ITrack, audioFeatures: IAudioFeatures) {
        this.id = track.id;
        this.name = track.name;
        this.artists = track.artists;
        this.audioFeatures = audioFeatures;
    }
}
