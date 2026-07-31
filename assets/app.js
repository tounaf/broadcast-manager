/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the script tag in your base.html.twig.
 */
import './styles/app.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { ThemeProvider } from './components/theme/ThemeContext';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <ThemeProvider>
            <App />
        </ThemeProvider>
    );
}
