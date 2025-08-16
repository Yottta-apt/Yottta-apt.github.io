document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default jump behavior

            // Get the target element using its ID from the href
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Scroll smoothly to the target element
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log("Main portfolio JavaScript loaded and smooth scrolling enabled.");
});