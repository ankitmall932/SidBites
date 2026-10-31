

export default function Footer ()
{
    return (
        <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-stone-200 pt-5 text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© { new Date().getFullYear() } SidBites. All rights reserved.</p>
            <nav aria-label="Footer navigation" className="flex items-center gap-5">
                <h1>Made with ❤️ By Ankit Mall</h1>
            </nav>
        </footer>
    );
}