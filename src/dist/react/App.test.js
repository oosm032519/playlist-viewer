import { render, act } from '@testing-library/react';
import App from './App';
import { useApi } from './useApi';
jest.mock('./useApi');
describe('App', () => {
    it('renders without crashing', () => {
        render(React.createElement(App, null));
    });
    it('calls fetchVisitedPlaylists on mount', () => {
        const mockFetchVisitedPlaylists = jest.fn();
        useApi.mockReturnValue({
            fetchVisitedPlaylists: mockFetchVisitedPlaylists,
        });
        act(() => {
            render(React.createElement(App, null));
        });
        expect(mockFetchVisitedPlaylists).toHaveBeenCalled();
    });
    // Add more tests as needed
});
//# sourceMappingURL=App.test.js.map