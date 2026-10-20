'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ThemeButton ()
{
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore( subscribe, getClientSnapshot, getServerSnapshot );

    if ( !mounted )
    {
        return <button className="p-4 border border-gray-300 rounded-2xl shadow-2xl bg-gray-200" />;
    }

    return (
        <button type="button" aria-label={ resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme' } onClick={ () => setTheme( resolvedTheme === 'dark' ? 'light' : 'dark' ) } className={ `p-2 border cursor-pointer border-gray-300 rounded-2xl shadow-2xl ${ resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200' }` }>
            { resolvedTheme === 'dark' ? <Sun /> : <Moon /> }
        </button>
    );
}
