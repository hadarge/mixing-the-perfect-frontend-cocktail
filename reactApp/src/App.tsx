import {useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {LikeButton} from "./components/LikeButton.tsx";
import {VideoPlayer} from "./components/VideoPlayer.tsx";

function App() {
    const [count, setCount] = useState(0);

    const handleLikeChange = (isLiked: boolean, likeCount: number) => {
        console.log(
            `%c⚛️ likeChanged%c @react component %c${isLiked}%c, count: %c${likeCount}`,
            'color: #61dafb; font-weight: bold;',
            'color: gray;',
            'color: orange; font-weight: bold;',
            'color: gray;',
            'color: teal; font-weight: bold;'
        );
    };

    const handlePlay = () => {
        console.log(
            `%c▶️️ onPlay%c @react component`,
            'color: #61dafb; font-weight: bold;',
            'color: gray;'
        );
    };

    const handlePause = () => {
        console.log(
            `%c⏸️️ onPause%c @react component`,
            'color: #61dafb; font-weight: bold;',
            'color: gray;'
        );
    };

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>

            <LikeButton initial-like-count="46" onLikeChange={handleLikeChange}/>

            <VideoPlayer
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                onPlay={handlePlay}
                onPause={handlePause}
            />

            <VideoPlayer
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                onPlay={handlePlay}
                onPause={handlePause}
            />



            <button onClick={() => {
                const script = document.createElement('script');
                script.type = 'module';
                script.src = 'http://127.0.0.1:8080/assets/wcMain2.js';
                document.head.appendChild(script);
            }}>Dynamic load</button>
        </>
    );
}

export default App;
