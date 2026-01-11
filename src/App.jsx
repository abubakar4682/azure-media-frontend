import { useState } from 'react';
import ConsumerView from './components/ConsumerView';
import CreatorView from './components/CreatorView';

export default function App() {
    const [view, setView] = useState('consumer'); // 'consumer' or 'creator'

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="nav-content">
                    <h1 className="logo">AzureGram</h1>
                    <div className="nav-actions">
                        <button
                            className={`nav-btn ${view === 'consumer' ? 'active' : ''}`}
                            onClick={() => setView('consumer')}
                        >
                            <span>🏠</span> Feed
                        </button>
                        <button
                            className={`nav-btn ${view === 'creator' ? 'active' : ''}`}
                            onClick={() => setView('creator')}
                        >
                            <span>✨</span> Create
                        </button>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                {view === 'consumer' ? (
                    <ConsumerView />
                ) : (
                    <CreatorView onPhotoUploaded={() => setView('consumer')} />
                )}
            </main>
        </div>
    );
}
