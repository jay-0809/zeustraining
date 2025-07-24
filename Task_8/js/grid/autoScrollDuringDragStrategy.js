export function setupAutoScroll(handler, axis = "both") {
    let intervalId = null;

    function checkAndScroll(e) {
        if (!intervalId) {
            intervalId = setInterval(() => {
                if (!lastEvent) return;

                const margin = 20;
                const speed = 25;
                const { clientX, clientY } = lastEvent;
                const { innerWidth, innerHeight } = window;

                let dx = 0, dy = 0;

                if (axis === "x" || axis === "both") {
                    if (clientX > innerWidth - margin) dx = speed;
                    else if (clientX < margin) dx = -speed;
                }

                if (axis === "y" || axis === "both") {
                    if (clientY > innerHeight - margin) dy = speed;
                    else if (clientY < margin) dy = -speed;
                }

                if (dx !== 0 || dy !== 0) {
                    const scrollX = handler.grid.grid.scrollX + dx;
                    const scrollY = handler.grid.grid.scrollY + dy;

                    if (scrollX >= 0 && scrollY >= 0) {
                        handler.grid.grid.pointer.handleCustomScroll(scrollX, scrollY);
                        if (handler.onMouseMove) handler.onMouseMove(lastEvent);
                    }
                } 
            }, 40);
        }
    }
        let lastEvent = null;

        return {
            onMove(e) {
                lastEvent = e;
                checkAndScroll(e);
            },
            cancel() {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }
        };
    }
