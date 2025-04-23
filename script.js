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
    
    // PDF download functionality - Improved for better formatting
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadPdfOldButton = document.getElementById('download-pdf-old');
    
    const downloadPdf = function() {
        try {
            const { jsPDF } = window.jspdf;
            
            // Before generating PDF, we'll temporarily modify some styles for better PDF output
            const cvContainer = document.querySelector('.cv-container');
            
            // Store original styles to restore later
            const originalStyles = {
                fontSize: window.getComputedStyle(document.body).fontSize,
                maxWidth: cvContainer.style.maxWidth,
                padding: cvContainer.style.padding,
                gap: cvContainer.style.gap
            };
            
            // Apply PDF-optimized styles
            document.body.style.fontSize = '10px'; // Smaller font size for PDF
            cvContainer.style.maxWidth = '100%';
            cvContainer.style.padding = '10px';
            cvContainer.style.gap = '15px';
            
            // Hide action buttons and any other non-essential elements for PDF
            const elementsToHideForPdf = document.querySelectorAll('.action-buttons-panel, .theme-toggle, .print-btn, .download-pdf');
            elementsToHideForPdf.forEach(el => {
                if (el) el.style.display = 'none';
            });
            
            // Create a new PDF document - A4 size
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            // Calculate optimal scale for content
            const contentWidth = cvContainer.offsetWidth;
            const contentHeight = cvContainer.offsetHeight;
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const marginX = 10; // Horizontal margin in mm
            const marginY = 10; // Vertical margin in mm
            const availableWidth = pageWidth - (2 * marginX);
            const availableHeight = pageHeight - (2 * marginY);
            
            // Use html2canvas with proper scaling
            html2canvas(cvContainer, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                allowTaint: true,
                width: contentWidth,
                height: contentHeight,
                backgroundColor: '#FFFFFF'
            }).then(canvas => {
                // Calculate scale to fit content on one or two pages
                const imgWidth = availableWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Add first page
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                doc.addImage(imgData, 'JPEG', marginX, marginY, imgWidth, imgHeight);
                
                // If content exceeds one page, add additional pages as needed
                let remainingHeight = imgHeight - availableHeight;
                let positionY = availableHeight;
                
                while (remainingHeight > 0) {
                    // Add a new page
                    doc.addPage();
                    
                    // Calculate position for next section
                    const offsetY = -(positionY - marginY);
                    
                    // Add image (same content but shifted up)
                    doc.addImage(imgData, 'JPEG', marginX, offsetY, imgWidth, imgHeight);
                    
                    // Update for next page if needed
                    positionY += availableHeight;
                    remainingHeight -= availableHeight;
                }
                
                // Save the PDF
                doc.save('Mauricio_Inocencio_CV.pdf');
                
                // Restore original styles
                document.body.style.fontSize = originalStyles.fontSize;
                cvContainer.style.maxWidth = originalStyles.maxWidth;
                cvContainer.style.padding = originalStyles.padding;
                cvContainer.style.gap = originalStyles.gap;
                
                // Restore visibility of hidden elements
                elementsToHideForPdf.forEach(el => {
                    if (el) el.style.display = '';
                });
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
