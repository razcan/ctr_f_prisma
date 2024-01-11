import { useThemeContext } from './app2Context';

export const ThemeSwitch = () => {
    const { theme, setTheme } = useThemeContext();

    return (
        <div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                Toggle theme
            </button>
        </div>
    );
};