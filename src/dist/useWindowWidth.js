"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowWidth = void 0;
const react_1 = require("react");
const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = (0, react_1.useState)(window.innerWidth);
    (0, react_1.useEffect)(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return windowWidth;
};
exports.useWindowWidth = useWindowWidth;
//# sourceMappingURL=useWindowWidth.js.map