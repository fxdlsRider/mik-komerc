import { getLang } from './i18n.js';

const form = document.querySelector('.contact-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const res = await fetch(`translations/${getLang()}.json`);
    const { errors } = await res.json();

    const fields = [
        { id: 'firstName', errorKey: 'first_name_required' },
        { id: 'lastName',  errorKey: 'last_name_required' },
        { id: 'email',     errorKey: 'email_required' },
        { id: 'company',   errorKey: 'company_required' },
        { id: 'businessType', errorKey: 'business_type_required' },
        { id: 'message',   errorKey: 'message_required' }
    ];

    let isValid = true;

    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value.trim()) {
            showError(input, errors[field.errorKey]);
            isValid = false;
        }
    });

    const email = document.getElementById('email');
    if (email.value && !email.value.includes('@')) {
        showError(email, errors.email_invalid);
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
