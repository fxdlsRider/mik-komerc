const form = document.querySelector('.contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fields = [
        { id: 'firstName', label: 'First Name' },
        { id: 'lastName', label: 'Last Name' },
        { id: 'email', label: 'Email' },
        { id: 'company', label: 'Company Name' },
        { id: 'businessType', label: 'Business Type' },
        { id: 'message', label: 'Message' }
    ];
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value.trim()) {
            showError(input, `${field.label} is required`);
            isValid = false;
        }
    });
    
    // Email format check
    const email = document.getElementById('email');
    if (email.value && !email.value.includes('@')) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (isValid) {
        form.submit();
    }
});

function showError(input, message) {
    input.classList.add('input-error');
    const error = document.createElement('p');
    error.classList.add('error-message');
    error.textContent = message;
    input.parentNode.appendChild(error);
}