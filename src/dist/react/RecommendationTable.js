import React, { useCallback, useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { useApi } from './useApi';
const RecommendationsTable = ({ playlist }) => {
    const [recommendations, setRecommendations] = useState([]);
    const { fetchRecommendations } = useApi();
    const fetchAndSetRecommendations = useCallback(() => {
        fetchRecommendations(playlist.tracks)
            .then(data => {
            setRecommendations(data);
        })
            .catch(error => console.error(error));
    }, [fetchRecommendations, playlist]);
    useEffect(() => {
        fetchAndSetRecommendations();
    }, [fetchAndSetRecommendations]);
    const data = React.useMemo(() => recommendations, [recommendations]);
    const columns = React.useMemo(() => [
        { Header: 'Track Name', accessor: 'name' },
        { Header: 'Artist', accessor: 'artists[0].name' },
    ], []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data });
    return (React.createElement("table", Object.assign({}, getTableProps(), { className: "min-w-full divide-y divide-gray-200" }),
        React.createElement("thead", { className: "bg-gray-50" }, headerGroups.map((headerGroup) => (React.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(column => (React.createElement("th", Object.assign({}, column.getHeaderProps(), { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }), column.render('Header')))))))),
        React.createElement("tbody", Object.assign({}, getTableBodyProps(), { className: "bg-white divide-y divide-gray-200" }), rows.map((row) => {
            prepareRow(row);
            return (React.createElement("tr", Object.assign({}, row.getRowProps()), row.cells.map(cell => (React.createElement("td", Object.assign({}, cell.getCellProps(), { className: "px-6 py-4 whitespace-nowrap" }), cell.render('Cell'))))));
        }))));
};
export default RecommendationsTable;
//# sourceMappingURL=RecommendationTable.js.map