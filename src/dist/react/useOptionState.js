import { useState } from 'react';
import { Option } from './CombinedContext';
export const useOptionState = () => {
    const [selectedOption, setSelectedOption] = useState(Option.PlaylistIdOption);
    return { selectedOption, setSelectedOption };
};
//# sourceMappingURL=useOptionState.js.map