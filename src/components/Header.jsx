import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Darkmode from 'darkmode-js';

const Header = () => {
    const { user, logout } = useAuth(); 
    const navigate = useNavigate();
    const [darkmodeInstance, setDarkmodeInstance] = useState(null); 

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    useEffect(() => {
        const options = {
            mixColor: '#fff', 
            backgroundColor: '#fff', 
            saveInCookies: true, 
            autoMatchOsTheme: true, 
        };

        const darkmode = new Darkmode(options);
        setDarkmodeInstance(darkmode); 
    }, []);

    const toggleDarkMode = () => {
        if (darkmodeInstance) {
            darkmodeInstance.toggle(); 
        }
    };

    
    return (
        <header>
            <h1 onClick={() => navigate('/')}>
                Gestion d'événements
            </h1>
            <div>
            <button class="darkmode-button" onClick={toggleDarkMode} title="Activer/Désactiver le mode sombre">
                    🌓
                </button>
                {user ? (
                    <>
                        <span>Bienvenue, {user.username}</span>
                        <button onClick={handleLogout}
                        class="button"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button class="button" onClick={() => navigate('/register')}>
                            Inscription
                        </button>
                        <button class="button" onClick={() => navigate('/login')}>
                            Connexion
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
