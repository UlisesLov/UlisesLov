/**
 * Main JavaScript file for Zenitch Website
 */

// Preparar tablas para responsividad
function prepareResponsiveTables() {
    const tables = document.querySelectorAll('.tab-pane table');

    tables.forEach(table => {
        // Obtener todos los encabezados
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());

        // Agregar data-title a cada celda del cuerpo de la tabla
        const bodyCells = table.querySelectorAll('tbody td');

        bodyCells.forEach((cell, index) => {
            // Calcular el índice del encabezado correspondiente a esta celda
            const headerIndex = index % headers.length;
            // Asignar el texto del encabezado como data-title
            cell.setAttribute('data-title', headers[headerIndex]);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 50
    });

    // Ejecutar función para preparar tablas responsivas
    prepareResponsiveTables();

    // Mejorar funcionalidad del menú móvil
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (mobileMenuToggle) {
        // Crear overlay para el menú móvil
        const menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        body.appendChild(menuOverlay);

        // Crear botón de cierre
        const menuClose = document.createElement('div');
        menuClose.className = 'menu-close';
        menuClose.innerHTML = '<i class="fas fa-times"></i>';
        navMenu.appendChild(menuClose);
        
        // Añadir función para abrir menú
        mobileMenuToggle.addEventListener('click', function () {
            navMenu.classList.add('active');
            menuOverlay.classList.add('active');
            body.style.overflow = 'hidden'; // Prevenir scroll
        });

        // Añadir función para cerrar menú
        const closeMenu = function () {
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            body.style.overflow = '';
        };

        menuClose.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);

        // Cerrar menú al hacer clic en enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Cerrar menú al cambiar orientación
        window.addEventListener('orientationchange', closeMenu);
    }

    // Hacer tarjetas de soluciones expandibles en móvil
    if (window.innerWidth <= 768) {
        const solutionCards = document.querySelectorAll('.solution-card');

        solutionCards.forEach(card => {
            card.addEventListener('click', function (e) {
                // Evitar activación al hacer clic en botones
                if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                    return;
                }

                this.classList.toggle('expanded');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scroll to target with smooth behavior
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });

                // Update active nav link
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Initialize network graph for tech section
    initTechNodes();
});

// Initialize tech nodes visualization
function initTechNodes() {
    const canvas = document.getElementById('tech-nodes-canvas');

    if (!canvas) return;

    // Use Three.js to create network visualization
    // This is a simplified version - you can expand this functionality
    // based on your specific design requirements

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    canvas.appendChild(renderer.domElement);

    // Create nodes and connections
    const nodes = [];
    const connections = [];
    const numNodes = 30;

    // Create nodes
    for (let i = 0; i < numNodes; i++) {
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0x3d5afe : 0xffffff,
            transparent: true,
            opacity: 0.7
        });

        const node = new THREE.Mesh(geometry, material);

        // Random position
        node.position.x = (Math.random() - 0.5) * 10;
        node.position.y = (Math.random() - 0.5) * 10;
        node.position.z = (Math.random() - 0.5) * 10;

        // Random velocity for animation
        node.userData = {
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };

        scene.add(node);
        nodes.push(node);
    }

    // Create connections between nodes
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            // Only connect some nodes to avoid too many lines
            if (Math.random() > 0.9) {
                const geometry = new THREE.BufferGeometry();
                const material = new THREE.LineBasicMaterial({
                    color: 0x3d5afe,
                    transparent: true,
                    opacity: 0.2
                });

                const points = [
                    nodes[i].position,
                    nodes[j].position
                ];

                geometry.setFromPoints(points);

                const line = new THREE.Line(geometry, material);
                scene.add(line);

                connections.push({
                    line: line,
                    pointA: i,
                    pointB: j
                });
            }
        }
    }

    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Update node positions
        nodes.forEach(node => {
            node.position.x += node.userData.velocity.x;
            node.position.y += node.userData.velocity.y;
            node.position.z += node.userData.velocity.z;

            // Boundary checks
            if (Math.abs(node.position.x) > 5) {
                node.userData.velocity.x *= -1;
            }
            if (Math.abs(node.position.y) > 5) {
                node.userData.velocity.y *= -1;
            }
            if (Math.abs(node.position.z) > 5) {
                node.userData.velocity.z *= -1;
            }
        });

        // Update connection lines
        connections.forEach(connection => {
            const pointsArray = [
                nodes[connection.pointA].position,
                nodes[connection.pointB].position
            ];

            connection.line.geometry.setFromPoints(pointsArray);
            connection.line.geometry.attributes.position.needsUpdate = true;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = canvas.clientWidth;
        const newHeight = canvas.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    });
}