import React, {useContext} from 'react';
import CombinedContext from './CombinedContext';
import { Button } from './Button';

const FetchVisitedPlaylistsButton: React.FC = () => {
    const {
        setShowVisitedPlaylists,
        showVisitedPlaylists
    } = useContext(CombinedContext);

    const handleClick = () => {
        console.log('handleClickが呼び出されました');
        setShowVisitedPlaylists(!showVisitedPlaylists);
    };
    
    return (
        <Button onClick={handleClick}>
            参照履歴を表示
        </Button>
    );
};

export default FetchVisitedPlaylistsButton;
