/**
 * Custom animations for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Animate the cube rotation
    const cube = document.querySelector('.cube');
    if (cube) {
        // The basic animation is handled by CSS keyframes
        // This is for additional interactivity
        
        let rotateX = 0;
        let rotateY = 0;
        const heroSection = document.querySelector('.hero-section');
        
        heroSection.addEventListener('mousemove', (e) => {
            // Calculate mouse position relative to the center of the section
            const rect = heroSection.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Normalize the distance from center (-1 to 1)
            const normalizedX = (e.clientX - centerX) / (rect.width / 2);
            const normalizedY = (e.clientY - centerY) / (rect.height / 2);
            
            // Apply the rotation based on mouse position
            rotateX = normalizedY * 15; // Max 15 degrees
            rotateY = normalizedX * 15; // Max 15 degrees
            
            // Apply the rotation
            cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Reset rotation when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            cube.style.transform = '';
            
            // Re-enable the CSS animation after a short delay
            setTimeout(() => {
                cube.style.animation = 'rotate 20s infinite linear';
            }, 500);
        });
        
        // Disable CSS animation when mouse enters
        heroSection.addEventListener('mouseenter', () => {
            cube.style.animation = 'none';
        });
    }
    
    // Parallax scrolling effect
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        // Parallax for hero section
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        }
        
        // Parallax for other elements
        document.querySelectorAll('.parallax').forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.1;
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
    
    // Typing text animation
    const typingElements = document.querySelectorAll('.typing-text');
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start the typing animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    });
    
    // Smooth number counter animation
    const counterElements = document.querySelectorAll('.counter');
    counterElements.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = parseInt(counter.getAttribute('data-duration') || 2000);
        
        let startTime = null;
        const startValue = 0;
        
        function animateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            const currentValue = Math.floor(percentage * (target - startValue) + startValue);
            counter.textContent = currentValue;
            
            if (percentage < 1) {
                requestAnimationFrame(animateCounter);
            } else {
                counter.textContent = target;
            }
        }
        
        // Start the counter animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(animateCounter);
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
});