
let scene, camera, renderer, particles = [];

function initThreeJS() {
    const container = document.getElementById('canvas-container');


    scene = new THREE.Scene();


    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0e27, 0.8);
    container.appendChild(renderer.domElement);


    createAnimatedCubes();


    createParticles();


    const light = new THREE.PointLight(0x00d9ff, 1, 500);
    light.position.set(0, 100, 100);
    scene.add(light);

    const light2 = new THREE.PointLight(0xff006e, 1, 500);
    light2.position.set(50, -100, 100);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Animation Loop
    animate();

    // Handle Resize
    window.addEventListener('resize', onWindowResize);
}

function createAnimatedCubes() {
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshPhongMaterial({ color: 0x00d9ff, wireframe: false });

    for (let i = 0; i < 3; i++) {
        const cube = new THREE.Mesh(geometry, material.clone());
        cube.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200
        );
        cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        cube.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        scene.add(cube);
        particles.push(cube);
    }
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < 300; i++) {
        positions.push(
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400
        );
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

    const material = new THREE.PointsMaterial({ color: 0x00d9ff, size: 2, transparent: true });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    particles.push(points);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate cubes
    particles.forEach((particle, index) => {
        if (particle.userData.rotationSpeed) {
            particle.rotation.x += particle.userData.rotationSpeed.x;
            particle.rotation.y += particle.userData.rotationSpeed.y;
            particle.rotation.z += particle.userData.rotationSpeed.z;
        }
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Utility Functions
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize on load
window.addEventListener('load', initThreeJS);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu if open
            const menuBtn = document.getElementById('menuBtn');
            const mobileMenu = document.getElementById('mobileMenu');
            if (menuBtn && mobileMenu) {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        }
    });
});

// Mobile Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn) {
    menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Close menu when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('nav') && !event.target.closest('#mobileMenu')) {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value;

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
                    position: fixed;
                    top: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, rgba(0, 217, 255, 0.9), rgba(255, 0, 110, 0.9));
                    color: white;
                    padding: 1.5rem 2rem;
                    border-radius: 8px;
                    z-index: 1000;
                    font-weight: 600;
                    box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
                    animation: slideDown 0.5s ease;
                `;
        successMsg.textContent = `✓ Thank you ${name}! We'll get back to you within 24 hours.`;
        document.body.appendChild(successMsg);

        // Clear form
        contactForm.reset();

        // Remove message after 5 seconds
        setTimeout(() => {
            successMsg.style.animation = 'slideUp 0.5s ease';
            setTimeout(() => successMsg.remove(), 500);
        }, 5000);
    });
}

// Add animations
const style = document.createElement('style');
style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
document.head.appendChild(style);




//  JavaScript for Process Section 
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const service = this.getAttribute('data-service');

        // Update active button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Update visible timeline
        document.querySelectorAll('.timeline-content').forEach(content => {
            content.style.display = 'none';
        });
        document.querySelector(`.timeline-content[data-service="${service}"]`).style.display = 'block';
    });
});