export class DescriptionManager {
    descriptions: Record<string, string> = {
        'Acousticness': 'アコースティック感。1に近いほどアコースティック。',
        'Danceability': '踊りやすさ。1に近いほど踊りやすい。',
        'Energy': '曲の激しさ。1に近いほど激しい。',
        'Liveness': 'ライブ感。1に近いほどライブらしい。',
        'Speechiness': '曲中の話し言葉の存在度合い。1に近いほど話し言葉が多い。',
        'Valence': '明るさ。1に近いほど明るい。'
    };
}
