function initCanvas() {
    const canvas = document.getElementById('my_canvas');
    const ctx = canvas.getContext('2d');
    const cW = canvas.width;
    const cH = canvas.height;

    // Cargar imágenes
    const backgroundImage = new Image();
    const naveImage = new Image();
    const enemiespic1 = new Image();
    const enemiespic2 = new Image();

    backgroundImage.src = "images/wall.jpg";
    naveImage.src = "images/spaceship-pic.png";
    enemiespic1.src = "images/enemigo1.png";
    enemiespic2.src = "images/enemigo2.png";

    // Variables del juego
    let imagesLoaded = 0;
    const totalImages = 4;
    const enemies = [];
    const misiles = [];
    let gameOver = false;

    // Función para comprobar si las imágenes están cargadas
    function checkImagesLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            startGame();
        }
    }

    // Asignar el evento de carga de imágenes
    backgroundImage.onload = checkImagesLoaded;
    naveImage.onload = checkImagesLoaded;
    enemiespic1.onload = checkImagesLoaded;
    enemiespic2.onload = checkImagesLoaded;

    // Función que empieza el juego cuando todas las imágenes se cargan
    function startGame() {
        // Lanzador (nave)
        const launcher = {
            x: cW / 2 - 25,
            y: cH - 100,
            w: 50,
            h: 50,
            direccion: '',
        };

        // Generar enemigos de forma continua
        function generateEnemy() {
            const xPosition = Math.random() * (cW - 50);
            const enemy = {
                x: xPosition,
                y: -50,
                w: 50,
                h: 30,
                image: Math.random() > 0.5 ? enemiespic1 : enemiespic2
            };
            enemies.push(enemy);
        }

        // Función de renderizado
        function render() {
            ctx.clearRect(0, 0, cW, cH); // Limpiar el canvas
            ctx.drawImage(backgroundImage, 0, 0, cW, cH);
            ctx.drawImage(naveImage, launcher.x, launcher.y, launcher.w, launcher.h);

            // Dibujar misiles
            for (let i = 0; i < misiles.length; i++) {
                const m = misiles[i];
                ctx.fillStyle = 'yellow'; // Color de misiles
                ctx.fillRect(m.x, (m.y -= 5), m.w, m.h);
                if (m.y <= 0) misiles.splice(i, 1);
            }

            // Dibujar enemigos
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];
                ctx.drawImage(enemy.image, enemy.x, (enemy.y += 0.5), enemy.w, enemy.h);

                // Detectar colisión de misiles con enemigos
                for (let j = 0; j < misiles.length; j++) {
                    const m = misiles[j];
                    if (
                        m.x + m.w >= enemy.x && m.x <= enemy.x + enemy.w &&
                        m.y >= enemy.y && m.y <= enemy.y + enemy.h
                    ) {
                        enemies.splice(i, 1);
                        misiles.splice(j, 1);
                        i--; // Ajuste después de eliminar enemigo
                    }
                }

                // Fin del juego si un enemigo llega a la parte inferior
                if (enemy.y >= cH) {
                    gameOver = true;
                    break;
                }
            }

            // Si se acaba el juego
            if (gameOver) {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, cW, cH);
                ctx.fillStyle = 'white';
                ctx.font = 'bold 40px Arial';
                ctx.fillText("Game Over!", cW / 2 - 100, cH / 2);
            }
        }

        // Generar enemigos cada 2 segundos
        setInterval(generateEnemy, 2000);

        // Ciclo de animación
        const animateInterval = setInterval(() => {
            if (!gameOver) {
                render();
            } else {
                clearInterval(animateInterval); // Detener animación cuando el juego termine
            }
        }, 16); // 60 FPS

        // Eventos de teclado para mover la nave y disparar misiles
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            if (key === 'ArrowLeft' && launcher.x > 0) launcher.x -= 5;
            if (key === 'ArrowRight' && launcher.x < cW - launcher.w) launcher.x += 5;
            if (key === 'ArrowUp' && launcher.y > 0) launcher.y -= 5;
            if (key === 'ArrowDown' && launcher.y < cH - launcher.h) launcher.y += 5;

            if (key === 'a') {
                misiles.push({
                    x: launcher.x + launcher.w / 2 - 1.5,
                    y: launcher.y,
                    w: 3,
                    h: 10
                });
            }
        });
    }
}

window.addEventListener('load', initCanvas);
