import { useEffect } from "react";
import { startGame, stopGame } from "../phaser/game";

export default function PhaserGame() {
    useEffect(() => {
        startGame();

        return () => {
            stopGame();
        };
    }, []);

    return (
        <div
            id="game-container"
            style={{
                width: "1280px",
                height: "720px",
                margin: "0 auto"
            }}
        />
    );
}
