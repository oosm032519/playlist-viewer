import React, {useContext, useEffect} from 'react';
import CombinedContext from './CombinedContext';

const VisitedPlaylistsTable: React.FC = () => {
    const {visitedPlaylists} = useContext(CombinedContext);

    // visitedPlaylists配列の内容をコンソールに出力
    useEffect(() => {
        console.log('visitedPlaylists:', visitedPlaylists);
    }, [visitedPlaylists]);

    return (
        <table className="w-full table-auto">
            <thead>
                <tr>
                    <th className="px-4 py-2">Playlist Name</th>
                    <th className="px-4 py-2">ID</th>
                </tr>
            </thead>
            <tbody>
            {visitedPlaylists.map((playlist: { name: string; id: string; }) => (
                <tr key={playlist.id}>
                    <td className="border px-4 py-2">{playlist.name}</td>
                    <td className="border px-4 py-2">{playlist.id}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default VisitedPlaylistsTable;
