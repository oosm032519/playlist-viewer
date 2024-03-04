import React from 'react';
class DescriptionManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptions: {
                'Acousticness': 'アコースティック感。1に近いほどアコースティック。',
                'Danceability': '踊りやすさ。1に近いほど踊りやすい。',
                'Energy': '曲の激しさ。1に近いほど激しい。',
                'Liveness': 'ライブ感。1に近いほどライブらしい。',
                'Speechiness': '曲中の話し言葉の存在度合い。1に近いほど話し言葉が多い。',
                'Valence': '明るさ。1に近いほど明るい。'
            }
        };
    }
    render() {
        return (React.createElement("div", null, Object.entries(this.state.descriptions).map(([key, value]) => (React.createElement("p", { key: key },
            React.createElement("strong", null,
                key,
                ":"),
            " ",
            value)))));
    }
}
export default DescriptionManager;
//# sourceMappingURL=descriptions.js.map