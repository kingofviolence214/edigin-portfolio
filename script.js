document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. TYPEWRITER EFFECT ---
    const words = ["Full-Stack Developer", "Software Engineer", "Tech Instructor", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById("typewriter");

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; 
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    // --- 2. MODAL LOGIC ---
    const modal = document.getElementById("checkoutModal");
    const closeBtn = document.querySelector(".close-btn");
    const enrollButtons = document.querySelectorAll(".enroll-btn");
    
    const modalCourseName = document.getElementById("modalCourseName");
    const modalCoursePrice = document.getElementById("modalCoursePrice");
    const checkoutForm = document.getElementById("checkoutForm");

    enrollButtons.forEach(button => {
        button.addEventListener("click", function() {
            const courseName = this.getAttribute("data-course");
            const coursePrice = this.getAttribute("data-price");

            modalCourseName.textContent = courseName;
            modalCoursePrice.textContent = coursePrice + " / mo";

            modal.style.display = "flex";
        });
    });

    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // --- 3. PAYSTACK CHECKOUT ---
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        const name = document.getElementById("studentName").value;
        const email = document.getElementById("studentEmail").value;
        const phone = document.getElementById("studentPhone").value;
        
        let rawPrice = modalCoursePrice.textContent.replace(/[^0-9]/g, ''); 
        const amountInKobo = parseInt(rawPrice) * 100;

        let handler = PaystackPop.setup({
            key: 'pk_test_b5ef0b369d0cb7ba10851106fb636032bab99cca', // PASTE YOUR KEY HERE
            email: email,
            amount: amountInKobo,
            currency: 'NGN',
            ref: 'CP_' + Math.floor((Math.random() * 1000000000) + 1), 
            callback: function(response) {
                alert('Payment complete! Reference: ' + response.reference + '\n\nWelcome to ' + modalCourseName.textContent + ', ' + name + '!');
                modal.style.display = "none";
                checkoutForm.reset();
            },
            onClose: function() {
                alert('Transaction cancelled.');
            }
        });

        handler.openIframe();
    });

});