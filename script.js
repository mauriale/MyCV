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
    
    // PDF generation using pdfmake and dom-to-image
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadPdfOldButton = document.getElementById('download-pdf-old');
    
    const downloadPdf = async function() {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'pdf-loading';
        loadingIndicator.innerHTML = '<div class="spinner"></div><p>Generando PDF...</p>';
        document.body.appendChild(loadingIndicator);
        
        try {
            // Remember current theme and switch to light theme temporarily
            const originalTheme = document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', 'light');
            
            // Mark body for PDF generation styling
            document.body.classList.add('generating-pdf');
            
            // Wait for styles to apply
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Use dom-to-image to capture the CV
            const cvElement = document.querySelector('.cv-container');
            
            // Create a pdfmake document definition
            const docDefinition = {
                pageSize: 'A4',
                pageMargins: [20, 20, 20, 20],
                content: [],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    normal: {
                        fontSize: 10,
                        margin: [0, 3, 0, 3]
                    }
                }
            };
            
            try {
                // Use dom-to-image to convert CV to image
                const dataUrl = await domtoimage.toPng(cvElement, {
                    quality: 1.0,
                    bgcolor: 'white',
                    width: cvElement.offsetWidth,
                    height: cvElement.offsetHeight,
                    style: {
                        'transform': 'scale(1)',
                        'transform-origin': 'top left'
                    }
                });
                
                // Get image dimensions
                const img = new Image();
                img.src = dataUrl;
                
                await new Promise((resolve) => {
                    img.onload = function() {
                        // Calculate dimensions
                        const imgWidth = docDefinition.pageSize.width - (docDefinition.pageMargins[0] + docDefinition.pageMargins[2]);
                        const imgHeight = img.height * (imgWidth / img.width);
                        
                        // Add image to the PDF content
                        docDefinition.content.push({
                            image: dataUrl,
                            width: imgWidth,
                            // Only show part of the image on first page
                            fit: [imgWidth, 720] // A4 height (841.89) - margins
                        });
                        
                        // If image is larger than page height, add more pages
                        if (imgHeight > 720) { // A4 usable height in points
                            docDefinition.content.push({
                                image: dataUrl,
                                width: imgWidth,
                                pageBreak: 'before',
                                // Position and crop image for second page
                                fit: [imgWidth, 720],
                                margin: [0, -720, 0, 0] // Move image up to show bottom part
                            });
                        }
                        
                        resolve();
                    };
                    
                    img.onerror = function() {
                        // Fallback if image loading fails
                        docDefinition.content.push({
                            text: 'Failed to load CV image',
                            style: 'header'
                        });
                        resolve();
                    };
                });
                
                // Create and download the PDF
                pdfMake.createPdf(docDefinition).download("Mauricio_Inocencio_CV.pdf");
                
            } catch (imgError) {
                console.error('Error capturing image:', imgError);
                
                // Fallback to text-based PDF
                docDefinition.content.push({
                    text: 'PDF generation failed - please use print function instead',
                    style: 'header'
                });
                
                pdfMake.createPdf(docDefinition).download("Mauricio_Inocencio_CV.pdf");
            }
        } catch (error) {
            console.error('Error in PDF generation:', error);
            alert('Hubo un problema al generar el PDF. Por favor intenta utilizar la función de impresión del navegador.');
        } finally {
            // Clean up
            document.body.classList.remove('generating-pdf');
            document.documentElement.setAttribute('data-theme', originalTheme || 'light');
            if (document.body.contains(loadingIndicator)) {
                document.body.removeChild(loadingIndicator);
            }
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
