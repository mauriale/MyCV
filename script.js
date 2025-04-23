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
    
    // PDF generation using html2pdf.js
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadPdfOldButton = document.getElementById('download-pdf-old');
    
    const downloadPdf = function() {
        // Ensure we're in light mode for PDF generation
        const originalTheme = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', 'light');
        
        // Add PDF generation class to body
        document.body.classList.add('pdf-generation');
        
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'pdf-loading';
        loadingIndicator.innerHTML = '<div class="spinner"></div><p>Generando PDF...</p>';
        document.body.appendChild(loadingIndicator);
        
        // Get the CV container
        const element = document.querySelector('.cv-container');
        
        // Clone the element to modify it without affecting the original
        const clone = element.cloneNode(true);
        
        // Apply PDF-specific styling
        clone.classList.add('pdf-export');
        
        // Create a temporary container for the clone
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.appendChild(clone);
        document.body.appendChild(tempContainer);
        
        // Configure html2pdf options
        const opt = {
            margin: [10, 10, 10, 10],
            filename: 'Mauricio_Inocencio_CV.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true,
                letterRendering: true,
                scrollY: 0,
                windowWidth: 1200,
                logging: false
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Generate PDF
        html2pdf().from(clone).set(opt).save().then(() => {
            // Clean up
            document.body.removeChild(tempContainer);
            document.body.removeChild(loadingIndicator);
            document.body.classList.remove('pdf-generation');
            document.documentElement.setAttribute('data-theme', originalTheme);
        }).catch(error => {
            console.error('PDF generation failed:', error);
            // Clean up even on error
            document.body.removeChild(tempContainer);
            document.body.removeChild(loadingIndicator);
            document.body.classList.remove('pdf-generation');
            document.documentElement.setAttribute('data-theme', originalTheme);
            
            // Show error message
            alert('Hubo un problema al generar el PDF. Por favor intenta nuevamente o usa la función de impresión del navegador.');
        });
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
