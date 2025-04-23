document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Handle both old and new theme toggle buttons
    const themeToggleOld = document.getElementById('theme-toggle-old');
    const themeToggle = document.getElementById('theme-toggle');
    
    const toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icons
        const updateIcon = (button) => {
            if (button) {
                button.innerHTML = newTheme === 'light' 
                    ? '<i class="fas fa-moon"></i>' 
                    : '<i class="fas fa-sun"></i>';
            }
        };
        
        updateIcon(themeToggleOld);
        updateIcon(themeToggle);
    };
    
    // Set initial icon states
    const setInitialIcons = () => {
        const moonIcon = '<i class="fas fa-moon"></i>';
        const sunIcon = '<i class="fas fa-sun"></i>';
        const icon = savedTheme === 'light' ? moonIcon : sunIcon;
        
        if (themeToggleOld) themeToggleOld.innerHTML = icon;
        if (themeToggle) themeToggle.innerHTML = icon;
    };
    
    setInitialIcons();
    
    // Add click handlers
    if (themeToggleOld) themeToggleOld.addEventListener('click', toggleTheme);
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    // Handle both print buttons
    const printButton = document.getElementById('print-btn');
    const printCvButton = document.getElementById('print-cv');
    
    const printCV = function() {
        window.print();
    };
    
    if (printButton) printButton.addEventListener('click', printCV);
    if (printCvButton) printCvButton.addEventListener('click', printCV);
    
    // PDF generation - completely new approach
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadPdfOldButton = document.getElementById('download-pdf-old');
    
    const downloadPdf = function() {
        // For browsers without proper PDF generation capability, just open a print dialog
        // which allows saving as PDF through the browser's print interface
        
        // Display a helpful message to the user
        alert('Para obtener tu CV en PDF, usa la opción "Guardar como PDF" en el diálogo de impresión que aparecerá a continuación.');
        
        // Use the browser's built-in print functionality
        window.print();
    };
    
    if (downloadPdfButton) downloadPdfButton.addEventListener('click', downloadPdf);
    if (downloadPdfOldButton) downloadPdfOldButton.addEventListener('click', downloadPdf);
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Alt+P for print
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            printCV();
        }
        
        // Alt+D for download PDF
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            downloadPdf();
        }
        
        // Alt+T for toggle theme
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    });
    
    // Ensure external links open in new tabs and have proper attributes
    document.querySelectorAll('a[href^="http"], a[href^="https"]').forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // Focus first element when using skip link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        });
    }
});
