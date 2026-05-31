import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './StoryboardEngine.jsx';

// Note: intentionally NOT wrapping in <React.StrictMode>. The app installs a
// global window.fetch wrapper inside a useEffect; StrictMode's dev double-invoke
// would patch/unpatch/patch it and is unnecessary here.
createRoot(document.getElementById('root')).render(<App />);
