import { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext(null);

const ThemeContextProvider = ({ children }) => {

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setDarkMode(true);
            document.body.classList.add("dark-mode");
        }
    }, []);

    const toggleTheme = () => {
        setDarkMode(prev => {
            const newMode = !prev;
            if (newMode) {
                document.body.classList.add("dark-mode");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark-mode");
                localStorage.setItem("theme", "light");
            }
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContextProvider;