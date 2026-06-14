/**
 * Get the current theme from localStorage or system preference
 */
export const getCurrentTheme = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  // Check system preference
  if (globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

/**
 * Set the theme in both localStorage and DOM
 */
export const setTheme = (theme) => {
  if (theme !== "light" && theme !== "dark") {
    console.error('Invalid theme. Must be "light" or "dark"');
    return;
  }

  // Save to localStorage
  localStorage.setItem("theme", theme);

  // Apply to DOM
  document.documentElement.dataset.theme = theme;
};

/**
 * Toggle between light and dark theme
 */
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();

  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
  return newTheme;
};

/**
 * Initialize theme on app load
 */
export const initializeTheme = () => {
  const theme = getCurrentTheme();
  setTheme(theme);
  return theme;
};
