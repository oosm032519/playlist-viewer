import {useCallback} from 'react';

export function useSpotifyAuth() {
    const authorize = useCallback(async () => {
        try {
            const response = await fetch('/java/authorize');
            const uri = await response.text();
            console.log("認証が完了しました");
            console.log(uri);
            window.location.href = uri;
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        }
    }, []);
    
    return authorize;
}
