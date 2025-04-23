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
    
    // PDF download functionality
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadPdfOldButton = document.getElementById('download-pdf-old');
    
    const downloadPdf = function() {
        try {
            const { jsPDF } = window.jspdf;
            
            // Create a new PDF document
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Use html2canvas to capture the CV content
            html2canvas(document.querySelector('.cv-container'), {
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: true
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
                
                doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                
                // Add new pages if content exceeds a single page
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                // Save the PDF
                doc.save('Mauricio_Inocencio_CV.pdf');
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Could not generate PDF. Please make sure you have a modern browser with JavaScript enabled.');
        }
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
