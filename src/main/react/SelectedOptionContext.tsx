// SelectedOptionContext.tsx
import React from 'react';

export const SelectedOptionContext = React.createContext({
  selectedOption: 'playlistIdOption',
  setSelectedOption: (option: string) => {},
});
