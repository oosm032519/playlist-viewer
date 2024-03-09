"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_table_1 = require("react-table");
const CombinedContext_1 = __importDefault(require("./CombinedContext"));
const useApi_1 = require("./useApi");
const VisitedPlaylistsTable = () => {
    const { setIsLoading, setShowTracks, visitedPlaylists } = (0, react_1.useContext)(CombinedContext_1.default);
    const { fetchPlaylistById } = (0, useApi_1.useApi)();
    (0, react_1.useEffect)(() => {
        console.log('visitedPlaylists:', visitedPlaylists);
    }, [visitedPlaylists]);
    const data = (0, react_1.useMemo)(() => visitedPlaylists, [visitedPlaylists]);
    const columns = (0, react_1.useMemo)(() => [
        {
            Header: 'Playlist Name',
            accessor: 'name',
            Cell: ({ row }) => (react_1.default.createElement("div", { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(row.original.id);
                    setIsLoading(true);
                    yield fetchPlaylistById(row.original.id);
                    setIsLoading(false);
                    setShowTracks(true);
                }) }, row.values.name)),
        },
    ], []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = (0, react_table_1.useTable)({ columns, data });
    return (react_1.default.createElement("table", Object.assign({}, getTableProps(), { className: "w-full table-auto" }),
        react_1.default.createElement("thead", null, headerGroups.map((headerGroup) => (react_1.default.createElement("tr", Object.assign({}, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(column => (react_1.default.createElement("th", Object.assign({}, column.getHeaderProps(), { className: "px-4 py-2" }), column.render('Header')))))))),
        react_1.default.createElement("tbody", Object.assign({}, getTableBodyProps()), rows.map((row) => {
            prepareRow(row);
            return (react_1.default.createElement("tr", Object.assign({}, row.getRowProps()), row.cells.map(cell => (react_1.default.createElement("td", Object.assign({}, cell.getCellProps(), { className: "border px-4 py-2" }), cell.render('Cell'))))));
        }))));
};
exports.default = VisitedPlaylistsTable;
//# sourceMappingURL=VisitedPlaylistsTable.js.map