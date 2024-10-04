document.addEventListener("DOMContentLoaded", () => {
    document.body.style.backgroundImage = "url('../assets/background.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.margin = "0";
    document.body.style.height = "100vh";

    const menuButton = document.createElement("button");
    menuButton.textContent = "☰";
    menuButton.style.position = "absolute";
    menuButton.style.top = "10px";
    menuButton.style.right = "10px";
    menuButton.style.padding = "10px";
    menuButton.style.fontSize = "20px";
    document.body.appendChild(menuButton);

    const sideMenu = document.createElement("div");
    sideMenu.style.width = "300px";
    sideMenu.style.height = "100%";
    sideMenu.style.position = "fixed";
    sideMenu.style.top = "0";
    sideMenu.style.right = "-300px";
    sideMenu.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    sideMenu.style.overflowY = "auto";
    sideMenu.style.transition = "0.5s";
    document.body.appendChild(sideMenu);

    const icon = document.createElement("img");
    icon.src = "../assets/grass-1.png";
    icon.style.width = "100px";
    icon.style.marginTop = "20px";
    icon.style.cursor = "grab";
    icon.style.userSelect = "none";
    sideMenu.appendChild(icon);

    const grassIcons = [];

    const createDraggableIcon = () => {
        const draggableIcon = icon.cloneNode(true);
        draggableIcon.style.position = "absolute";
        draggableIcon.style.left = "10px";
        draggableIcon.style.bottom = "10px";
        draggableIcon.style.cursor = "move";
        document.body.appendChild(draggableIcon);
        grassIcons.push(draggableIcon);

        let isDragging = false;
        let startX;

        draggableIcon.addEventListener("mousedown", (event) => {
            isDragging = true;
            startX = event.clientX - draggableIcon.offsetLeft;
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                let newX = event.clientX - startX;

                newX = Math.max(0, Math.min(newX, window.innerWidth - draggableIcon.offsetWidth));

                draggableIcon.style.left = `${newX}px`;
                draggableIcon.style.bottom = "10px";
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        const createResizer = (position) => {
            const resizer = document.createElement("div");
            resizer.style.width = "10px";
            resizer.style.height = "10px";
            resizer.style.background = "red";
            resizer.style.position = "absolute";
            resizer.style.cursor = "nwse-resize";
            draggableIcon.appendChild(resizer);

            if (position === "top-left") {
                resizer.style.left = "0";
                resizer.style.top = "0";
            } else if (position === "top-right") {
                resizer.style.right = "0";
                resizer.style.top = "0";
            } else if (position === "bottom-left") {
                resizer.style.left = "0";
                resizer.style.bottom = "0";
            } else if (position === "bottom-right") {
                resizer.style.right = "0";
                resizer.style.bottom = "0";
            } else if (position === "top") {
                resizer.style.left = "50%";
                resizer.style.top = "0";
                resizer.style.transform = "translateX(-50%)";
            } else if (position === "bottom") {
                resizer.style.left = "50%";
                resizer.style.bottom = "0";
                resizer.style.transform = "translateX(-50%)";
            } else if (position === "left") {
                resizer.style.left = "0";
                resizer.style.top = "50%";
                resizer.style.transform = "translateY(-50%)";
            } else if (position === "right") {
                resizer.style.right = "0";
                resizer.style.top = "50%";
                resizer.style.transform = "translateY(-50%)";
            }

            resizer.addEventListener("mousedown", (event) => {
                event.stopPropagation();
                isDragging = false;
                const startWidth = draggableIcon.offsetWidth;
                const startHeight = draggableIcon.offsetHeight;
                const startX = event.clientX;
                const startY = event.clientY;

                const resizeIcon = (resizeEvent) => {
                    let newWidth = startWidth;
                    let newHeight = startHeight;

                    if (position.includes("right")) {
                        newWidth = startWidth + (resizeEvent.clientX - startX);
                    } else if (position.includes("left")) {
                        newWidth = startWidth - (resizeEvent.clientX - startX);
                        draggableIcon.style.left = `${draggableIcon.offsetLeft + (resizeEvent.clientX - startX)}px`;
                    }

                    if (position.includes("bottom")) {
                        newHeight = startHeight + (resizeEvent.clientY - startY);
                    } else if (position.includes("top")) {
                        newHeight = startHeight - (resizeEvent.clientY - startY);
                        draggableIcon.style.bottom = `${10 - newHeight}px`;
                    }

                    if (newWidth > 20 && newHeight > 20) {
                        draggableIcon.style.width = `${newWidth}px`;
                        draggableIcon.style.height = `${newHeight}px`;
                    }
                };

                document.addEventListener("mousemove", resizeIcon);

                document.addEventListener("mouseup", () => {
                    document.removeEventListener("mousemove", resizeIcon);
                }, { once: true });
            });
        };

        createResizer("top-left");
        createResizer("top-right");
        createResizer("bottom-left");
        createResizer("bottom-right");
        createResizer("top");
        createResizer("bottom");
        createResizer("left");
        createResizer("right");

        const exportButton = document.createElement("button");
        exportButton.textContent = "Export Code";
        exportButton.style.position = "absolute";
        exportButton.style.bottom = "10px";
        exportButton.style.right = "10px";
        sideMenu.appendChild(exportButton);

        exportButton.addEventListener("click", () => {
            const exportLines = grassIcons.map(icon => {
                const { offsetLeft: x, offsetHeight: height } = icon;
                return `{ type: 'grass', x: ${x}, y: window.innerHeight - ${height}, width: ${icon.offsetWidth}, height: ${height} },`;
            }).join('\n');

            console.log(exportLines);
            alert(exportLines);
        });
    };

    menuButton.addEventListener("click", () => {
        if (sideMenu.style.right === "0px") {
            sideMenu.style.right = "-300px";
        } else {
            sideMenu.style.right = "0px";
        }
    });

    icon.addEventListener("click", createDraggableIcon);
});
