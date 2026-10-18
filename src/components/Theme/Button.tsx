'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeButton ()
{
    const { theme, setTheme } = useTheme();
    return (
        <button onClick={ () => setTheme( theme === 'dark' ? 'light' : 'dark' ) } className={ `p-2 border border-gray-300 rounded-2xl shadow-2xl  ${ theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200' }` }>
            { theme === 'dark' ? <Sun /> : <Moon /> }
        </button>
    );
}
