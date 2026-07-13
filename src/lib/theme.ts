export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export function getSystemTheme(): Theme {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): Theme | null {
	const stored = localStorage.getItem(STORAGE_KEY);
	return stored === 'light' || stored === 'dark' ? stored : null;
}

export function getActiveTheme(): Theme {
	const current = document.documentElement.getAttribute('data-theme');
	return current === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
	document.documentElement.setAttribute('data-theme', theme);
}

export function setTheme(theme: Theme) {
	localStorage.setItem(STORAGE_KEY, theme);
	applyTheme(theme);
}
