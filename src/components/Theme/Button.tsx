'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeButton ()
{
    const { resolvedTheme, setTheme } = useTheme();
    return (
        <button onClick={ () => setTheme( resolvedTheme === 'dark' ? 'light' : 'dark' ) } className={ `p-2 border cursor-pointer border-gray-300 rounded-2xl shadow-2xl  ${ resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200' }` }>
            { resolvedTheme === 'dark' ? <Sun /> : <Moon /> }
        </button>
    );
}
