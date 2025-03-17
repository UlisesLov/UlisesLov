/**
 * Form validation and submission handling
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const companyField = document.getElementById('company');
            const messageField = document.getElementById('message');
            
            // Reset previous error states
            resetFormErrors();
            
            // Validate form
            let isValid = true;
            
            if (!nameField.value.trim()) {
                showError(nameField, 'Por favor, ingresa tu nombre');
                isValid = false;
            }
            
            if (!emailField.value.trim()) {
                showError(emailField, 'Por favor, ingresa tu email');
                isValid = false;
            } else if (!isValidEmail(emailField.value)) {
                showError(emailField, 'Por favor, ingresa un email válido');
                isValid = false;
            }
            
            if (!messageField.value.trim()) {
                showError(messageField, 'Por favor, ingresa tu mensaje');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    // Success state
                    submitButton.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
                    submitButton.style.backgroundColor = '#10b981';
                    
                    // Clear form
                    contactForm.reset();
                    
                    // Show success message
                    const formWrapper = contactForm.closest('.contact-form-wrapper');
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success-message';
                    successMessage.innerHTML = `
                        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                        <h3>Mensaje enviado con éxito</h3>
                        <p>Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
                    `;
                    
                    formWrapper.appendChild(successMessage);
                    
                    // Hide form
                    contactForm.style.display = 'none';
                    
                    // Reset button after some time
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                        submitButton.style.backgroundColor = '';
                    }, 5000);
                }, 2000);
            }
        });
        
        // Input validation on blur
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear error on focus
            input.addEventListener('focus', function() {
                clearError(this);
            });
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Validate a single field
    function validateField(field) {
        if (field.id === 'name' && !field.value.trim()) {
            showError(field, 'Por favor, ingresa tu nombre');
        } else if (field.id === 'email') {
            if (!field.value.trim()) {
                showError(field, 'Por favor, ingresa tu email');
            } else if (!isValidEmail(field.value)) {
                showError(field, 'Por favor, ingresa un email válido');
            }
        } else if (field.id === 'message' && !field.value.trim()) {
            showError(field, 'Por favor, ingresa tu mensaje');
        }
    }
    
    // Show error message
    function showError(field, message) {
        clearError(field);
        
        field.classList.add('error');
        field.style.borderColor = '#ff4d4d';
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        const parent = field.parentElement;
        parent.appendChild(errorMessage);
    }
    
    // Clear error message
    function clearError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const parent = field.parentElement;
        const errorMessage = parent.querySelector('.error-message');
        
        if (errorMessage) {
            parent.removeChild(errorMessage);
        }
    }
    
    // Reset all form errors
    function resetFormErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            message.parentElement.removeChild(message);
        });
        
        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.style.borderColor = '';
        });
    }
});