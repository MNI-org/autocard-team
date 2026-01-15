import React, { useEffect } from "react";
import { startGame, stopGame } from "../phaser/game";
import Navbar from "./Navbar";

export default function PhaserGame() {
    useEffect(() => {
        startGame();

        return () => {
            stopGame();
        };
    }, []);

    return (
    <Navbar curr={"game"}>
        <div
            id="game-container"
            style={{
                width: "1280px",
                height: "720px",
                margin: "0 auto"
            }}
        />
    </Navbar>
    );
}
