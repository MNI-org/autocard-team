import React from "react";
import { AuthProvider } from "./contexts/authContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CollectionEditor from "./pages/CollectionEditor";
import Collections from "./pages/Collections";
import CollectionMainPage from "./pages/CollectionMainPage";
import Profile from "./pages/Profile"
import LeaderBoardPage from "./pages/LeaderboardPage";
import PhaserGame from "./components/PhaserGame";


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/editor/:id" element={<CollectionEditor/>}/>
                    <Route path="/editor" element={<CollectionEditor/>}/>
                    <Route path="/collections/:id" element={<Collections/>}/>
                    <Route path="/collections" element={<Collections/>}/>
                    <Route path="/learn/:id" element={<CollectionMainPage/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/leaderboard" element={<LeaderBoardPage/>}/>
                    <Route path="/game" element={<PhaserGame />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;