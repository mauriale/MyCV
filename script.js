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
    
    // Simple PDF generation that ensures content is visible
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadPdfOldButton = document.getElementById('download-pdf-old');
    
    const downloadPdf = function() {
        try {
            // Check if jsPDF is loaded
            if (!window.jspdf || !window.jspdf.jsPDF) {
                console.error("jsPDF not loaded properly");
                alert("PDF generation library is not loaded. Please reload the page or try a different browser.");
                return;
            }
            
            const { jsPDF } = window.jspdf;
            
            // Set a light theme temporarily for PDF generation
            const originalTheme = document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', 'light');
            
            // Add a temporary print class to the body
            document.body.classList.add('generating-pdf');
            
            // Create PDF document
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Get container dimensions
            const container = document.querySelector('.cv-container');
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            
            // A4 dimensions in mm (slightly reduced to ensure margins)
            const pageWidth = 210 - 20; // A4 width minus margins
            const pageHeight = 297 - 20; // A4 height minus margins
            
            console.log("Starting PDF generation process...");
            
            // Use html2canvas with explicit dimensions and simplified settings
            html2canvas(container, {
                scale: 1.5, // Increased scale for better quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: true, // Enable logging for debugging
                width: containerWidth,
                height: containerHeight,
                scrollX: 0,
                scrollY: 0,
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight
            }).then(function(canvas) {
                console.log("Canvas generated successfully", canvas.width, canvas.height);
                
                try {
                    // Get canvas as an image
                    const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    
                    // Calculate scaled dimensions to fit on A4
                    const ratio = canvas.width / pageWidth;
                    const scaledHeight = canvas.height / ratio;
                    
                    // Add to PDF (10mm margins on all sides)
                    doc.addImage(imgData, 'JPEG', 10, 10, pageWidth, scaledHeight);
                    
                    // If content is taller than one page, add additional pages
                    if (scaledHeight > pageHeight) {
                        let remainingHeight = scaledHeight;
                        let currentPosition = 0;
                        
                        // First page already added
                        remainingHeight -= pageHeight;
                        currentPosition += pageHeight;
                        
                        // Add more pages if needed
                        while (remainingHeight > 0) {
                            doc.addPage();
                            doc.addImage(
                                imgData, 
                                'JPEG', 
                                10, // x position
                                10 - currentPosition, // y position (negative to show part of image)
                                pageWidth, 
                                scaledHeight
                            );
                            
                            currentPosition += pageHeight;
                            remainingHeight -= pageHeight;
                        }
                    }
                    
                    // Save the PDF
                    doc.save('Mauricio_Inocencio_CV.pdf');
                    console.log("PDF saved successfully");
                } catch (error) {
                    console.error("Error generating PDF from canvas:", error);
                    alert("There was an error creating your PDF. Error details: " + error.message);
                }
                
                // Restore original theme and remove temporary class
                document.documentElement.setAttribute('data-theme', originalTheme);
                document.body.classList.remove('generating-pdf');
                
            }).catch(function(error) {
                console.error("Error in html2canvas:", error);
                alert("There was an error capturing your CV for PDF. Error details: " + error.message);
                document.documentElement.setAttribute('data-theme', originalTheme);
                document.body.classList.remove('generating-pdf');
            });
            
        } catch (error) {
            console.error('Error in PDF generation process:', error);
            alert('Could not generate PDF. Error details: ' + error.message);
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
