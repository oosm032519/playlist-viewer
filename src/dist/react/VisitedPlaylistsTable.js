var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useContext, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import CombinedContext from './CombinedContext';
import { useApi } from './useApi';
const VisitedPlaylistsTable = () => {
    const { setIsLoading, setShowTracks, visitedPlaylists } = useContext(CombinedContext);
    const { fetchPlaylistById } = useApi();
    useEffect(() => {
        console.log('visitedPlaylists:', visitedPlaylists);
    }, [visitedPlaylists]);
    const data = useMemo(() => visitedPlaylists, [visitedPlaylists]);
    const columns = useMemo(() => [
        {
            Header: 'Playlist Name',
            accessor: 'name',
            Cell: ({ row }) => (React.createElement("div", { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(row.original.id);
                    setIsLoading(true);
                    yield fetchPlaylistById(row.original.id);
                    setIsLoading(false);
                    setShowTracks(true);
                }) }, row.values.name)),
        },
    ], []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data });
    return (React.createElement("table", Object.assign({}, getTableProps(), { className: "w-full table-auto" }),
        React.createElement("thead", null, headerGroups.map((headerGroup) => (React.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(column => (React.createElement("th", Object.assign({}, column.getHeaderProps(), { className: "px-4 py-2" }), column.render('Header')))))))),
        React.createElement("tbody", Object.assign({}, getTableBodyProps()), rows.map((row) => {
            prepareRow(row);
            return (React.createElement("tr", Object.assign({}, row.getRowProps()), row.cells.map(cell => (React.createElement("td", Object.assign({}, cell.getCellProps(), { className: "border px-4 py-2" }), cell.render('Cell'))))));
        }))));
};
export default VisitedPlaylistsTable;
//# sourceMappingURL=VisitedPlaylistsTable.js.map