import {useCallback} from 'react';

export function useSpotifyAuth(setMessage: (message: string) => void, setMessageType: (type: 'success' | 'error' | null) => void) {
    return useCallback(async () => {
        try {
            const response = await fetch('/java/authorize');
            const uri = await response.text();
            console.log("認証が完了しました");
            console.log(uri);
            window.location.href = uri;
            setMessage("Spotifyへのログインが完了しました");
            setMessageType('success');
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
            setMessage("Spotifyへのログインに失敗しました");
            setMessageType('error');
        }
    }, []);
}
