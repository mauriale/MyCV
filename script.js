document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Initialize language
    const savedLanguage = localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('data-language', savedLanguage);
    document.getElementById('language-select').value = savedLanguage;
    
    // Show the correct language content
    showLanguageContent(savedLanguage);
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        themeToggle.innerHTML = newTheme === 'light' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    });
    
    // Set initial icon
    themeToggle.innerHTML = savedTheme === 'light' 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
    
    // Language selector functionality
    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', function() {
        const selectedLanguage = this.value;
        document.documentElement.setAttribute('data-language', selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
        
        showLanguageContent(selectedLanguage);
    });
    
    // Print button functionality
    const printButton = document.getElementById('print-btn');
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // PDF download functionality
    const downloadPdfButton = document.getElementById('download-pdf');
    downloadPdfButton.addEventListener('click', function() {
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
            logging: false
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
    });
});

// Function to show content based on selected language
function showLanguageContent(language) {
    // Hide all language content
    document.querySelectorAll('[lang]').forEach(element => {
        element.classList.add('hidden');
    });
    
    // Show content for selected language
    document.querySelectorAll(`[lang="${language}"]`).forEach(element => {
        element.classList.remove('hidden');
    });
    
    // If no content exists for this language, show English as fallback
    if (document.querySelectorAll(`[lang="${language}"]:not(.hidden)`).length === 0) {
        document.querySelectorAll('[lang="en"]').forEach(element => {
            element.classList.remove('hidden');
        });
    }
}
