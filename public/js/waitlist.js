// waitlist.js
import { CONFIG } from '../config/config.js';

class WaitlistForm {
    constructor() {
        this.form = document.getElementById('waitlistForm');
        this.emailInput = document.getElementById('emailInput');
        this.successMessage = document.getElementById('successMessage');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const email = this.emailInput.value;

        try {
            const response = await fetch(`${CONFIG.API_URL}/api/waitlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess(data);
                this.form.reset();
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            this.showError('Unable to join waitlist. Please try again.');
        }
    }

    showSuccess(data) {
        this.successMessage.classList.remove('hidden');
        this.successMessage.classList.add('success-animation');
        
        const message = data.position <= 100 
            ? `🎉 Congratulations! You're in position ${data.position} of our waitlist. You'll get early access!` 
            : `✅ You're on our waitlist at position ${data.position}. We'll notify you when access becomes available.`;
        
        this.successMessage.innerHTML = message;
    }

    showError(message) {
        this.successMessage.classList.remove('hidden');
        this.successMessage.classList.add('success-animation');
        this.successMessage.innerHTML = `❌ ${message}`;
    }
}

// Initialize the form
new WaitlistForm();