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
    
    // Improved PDF download functionality
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadPdfOldButton = document.getElementById('download-pdf-old');
    
    const downloadPdf = function() {
        try {
            const { jsPDF } = window.jspdf;
            
            // Create a clone of the CV container to modify for PDF export
            const cvContainer = document.querySelector('.cv-container');
            const clone = cvContainer.cloneNode(true);
            
            // Apply PDF-specific styles to the clone
            preparePdfLayout(clone);
            
            // Temporarily append clone to the document for rendering
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            document.body.appendChild(clone);
            
            // Create a new PDF document
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            // A4 dimensions
            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 10; // margin in mm
            const contentWidth = pageWidth - (margin * 2);
            
            // Use html2canvas to capture the modified CV content
            html2canvas(clone, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                // Remove the clone from the document
                document.body.removeChild(clone);
                
                // Calculate dimensions to maintain aspect ratio
                const imgWidth = contentWidth;
                const ratio = canvas.width / imgWidth;
                const imgHeight = canvas.height / ratio;
                
                // Calculate number of pages needed
                const totalPages = Math.ceil(imgHeight / (pageHeight - (margin * 2)));
                
                // Add each page of content
                let heightLeft = imgHeight;
                let position = 0;
                
                // First page
                doc.addImage(
                    canvas.toDataURL('image/jpeg', 1.0),
                    'JPEG',
                    margin,
                    margin,
                    imgWidth,
                    imgHeight,
                    undefined,
                    'FAST'
                );
                heightLeft -= (pageHeight - (margin * 2));
                
                // Add additional pages if necessary
                for (let i = 1; i < totalPages; i++) {
                    position = -((pageHeight - (margin * 2)) * i);
                    doc.addPage();
                    doc.addImage(
                        canvas.toDataURL('image/jpeg', 1.0),
                        'JPEG',
                        margin,
                        margin,
                        imgWidth,
                        imgHeight,
                        undefined,
                        'FAST'
                    );
                }
                
                // Save the PDF with a descriptive filename
                doc.save('Mauricio_Inocencio_CV.pdf');
            });
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Could not generate PDF. Please make sure you have a modern browser with JavaScript enabled.');
        }
    };
    
    // Function to prepare the clone for PDF export
    function preparePdfLayout(clone) {
        // Ensure proper font sizes for PDF
        const style = document.createElement('style');
        style.textContent = `
            * {
                font-size: 10px !important;
                line-height: 1.3 !important;
            }
            h1 {
                font-size: 16px !important;
                margin-bottom: 6px !important;
            }
            h2 {
                font-size: 14px !important;
                margin: 10px 0 5px !important;
            }
            h3 {
                font-size: 12px !important;
                margin: 8px 0 4px !important;
            }
            .job-title {
                font-size: 12px !important;
            }
            .sidebar {
                padding: 10px !important;
            }
            .main-content {
                padding: 0 5px !important;
            }
            .cv-header {
                padding-bottom: 10px !important;
                margin-bottom: 10px !important;
            }
            .job {
                margin-bottom: 10px !important;
                padding-bottom: 5px !important;
            }
            ul li {
                margin-bottom: 3px !important;
            }
            .project-card {
                padding: 8px !important;
                margin-bottom: 8px !important;
                box-shadow: none !important;
                border: 1px solid #ddd !important;
            }
            .action-buttons-panel {
                display: none !important;
            }
            .skill-bar-container {
                height: 5px !important;
                margin-top: 2px !important;
            }
            p {
                margin-bottom: 3px !important;
            }
            .language-item {
                margin-bottom: 5px !important;
            }
            .job-header {
                margin-bottom: 2px !important;
            }
            .company, .date {
                font-size: 11px !important;
            }
            .location {
                margin-bottom: 4px !important;
                font-size: 9px !important;
            }
            .social-links {
                display: none !important;
            }
        `;
        
        clone.appendChild(style);
        
        // Optionally remove elements that aren't essential for the PDF
        clone.querySelectorAll('.action-buttons-panel, .skip-link').forEach(el => {
            el.remove();
        });
        
        // Compact some sections to fit better
        const additionalActivities = clone.querySelector('#activities-section');
        if (additionalActivities) {
            const sportsParagraph = additionalActivities.querySelector('p:nth-of-type(1)');
            const interestsParagraph = additionalActivities.querySelector('p:nth-of-type(2)');
            
            if (sportsParagraph) {
                sportsParagraph.style.fontSize = '8px';
            }
            
            if (interestsParagraph) {
                interestsParagraph.style.fontSize = '8px';
            }
        }
        
        return clone;
    }
    
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
