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
    
    // Direct PDF generation without browser dialog using jsPDF and dom-to-image
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadPdfOldButton = document.getElementById('download-pdf-old');
    
    const downloadPdf = async function() {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'pdf-loading';
        loadingIndicator.innerHTML = '<div class="spinner"></div><p>Generando PDF...</p>';
        document.body.appendChild(loadingIndicator);
        
        try {
            // Check if jsPDF is loaded
            if (!window.jspdf || !window.jspdf.jsPDF) {
                throw new Error("jsPDF library not loaded");
            }
            
            // Remember current theme and switch to light theme temporarily
            const originalTheme = document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', 'light');
            
            // Mark body for PDF generation styling
            document.body.classList.add('generating-pdf');
            
            // Function to wait a bit to ensure styles are applied
            const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
            await sleep(100);  // Short delay to allow CSS changes to apply
            
            // Get the CV container element
            const element = document.querySelector('.cv-container');
            
            // Load jsPDF module
            const { jsPDF } = window.jspdf;
            
            // A4 size in mm
            const a4Width = 210;
            const a4Height = 297;
            const margin = 10;
            
            // Create a new jsPDF instance
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            // Use html2canvas with custom configuration
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                windowWidth: 1200,
                logging: false,
                removeContainer: true,
                foreignObjectRendering: false,
                letterRendering: true
            });
            
            // Get canvas dimensions and calculate scale to fit A4
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            
            // Calculate scale to fit width (accounting for margins)
            const contentWidth = a4Width - (margin * 2);
            const contentHeight = a4Height - (margin * 2);
            const imgWidth = contentWidth;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            // Add to first page
            doc.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
            
            // If content is longer than one page, add more pages
            let heightLeft = imgHeight - contentHeight;
            let position = margin - contentHeight;
            
            while (heightLeft > 0) {
                doc.addPage();
                doc.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
                
                heightLeft -= contentHeight;
                position -= contentHeight;
            }
            
            // Save the PDF file
            doc.save('Mauricio_Inocencio_CV.pdf');
            
            // Clean up
            document.body.classList.remove('generating-pdf');
            document.documentElement.setAttribute('data-theme', originalTheme);
            document.body.removeChild(loadingIndicator);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            
            // Clean up on error
            document.body.classList.remove('generating-pdf');
            if (document.body.contains(loadingIndicator)) {
                document.body.removeChild(loadingIndicator);
            }
            
            // Restore original theme
            if (originalTheme) {
                document.documentElement.setAttribute('data-theme', originalTheme);
            }
            
            // Show error message
            alert('Hubo un problema al generar el PDF: ' + error.message);
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
