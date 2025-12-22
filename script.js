document.addEventListener('DOMContentLoaded', function () {
    // Initialize language
    const savedLanguage = getCurrentLanguage();
    setLanguage(savedLanguage);

    // Update all translatable elements
    function updatePageLanguage() {
        const lang = getCurrentLanguage();

        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', lang);

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = t(key);
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else if (element.hasAttribute('value')) {
                    element.value = translation;
                } else if (element.hasAttribute('title')) {
                    element.title = translation;
                }
            } else {
                element.textContent = translation;
            }
        });

        // Update aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            element.setAttribute('aria-label', t(key));
        });

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            // Update content that requires special handling
            function updateSpecificContent() {
                const lang = getCurrentLanguage();

                // Update job title
                const jobTitleElement = document.querySelector('.job-title');
                if (jobTitleElement) {
                    jobTitleElement.textContent = t('jobTitle');
                }

                // Update professional summary
                const summaryText = document.querySelector('#summary-section p');
                if (summaryText) {
                    summaryText.innerHTML = t('professionalSummaryText');
                }

                // Update section titles
                document.querySelectorAll('h2').forEach(h2 => {
                    const icon = h2.querySelector('i');
                    const iconHtml = icon ? icon.outerHTML + ' ' : '';

                    if (h2.closest('#skills-section')) {
                        h2.innerHTML = iconHtml + t('skills');
                    } else if (h2.closest('#languages-section')) {
                        h2.innerHTML = iconHtml + t('languages');
                    } else if (h2.closest('#education-section')) {
                        h2.innerHTML = iconHtml + t('education');
                    } else if (h2.closest('#certifications-section')) {
                        h2.innerHTML = iconHtml + t('certifications');
                    } else if (h2.closest('#activities-section')) {
                        h2.innerHTML = iconHtml + t('additionalActivities');
                    } else if (h2.closest('#summary-section')) {
                        h2.innerHTML = iconHtml + t('professionalSummary');
                    } else if (h2.closest('#projects-section')) {
                        h2.innerHTML = iconHtml + t('featuredProjects');
                    } else if (h2.closest('#experience-section')) {
                        h2.innerHTML = iconHtml + t('professionalExperience');
                    }
                });

                // Update h3 titles
                document.querySelectorAll('h3').forEach(h3 => {
                    const text = h3.textContent.trim();
                    if (text === 'Functional Skills' || text === 'Compétences Fonctionnelles') {
                        h3.textContent = t('functionalSkills');
                    } else if (text === 'Technical Skills' || text === 'Compétences Techniques') {
                        h3.textContent = t('technicalSkills');
                    } else if (text === 'Personal Skills' || text === 'Compétences Personnelles') {
                        h3.textContent = t('personalSkills');
                    } else if (text === 'Sports') {
                        h3.textContent = t('sports');
                    } else if (text === 'Interests' || text === 'Intérêts') {
                        h3.textContent = t('interests');
                    }
                });

                // Update language names and levels
                document.querySelectorAll('.language-name').forEach(span => {
                    const text = span.textContent.trim();
                    if (text === 'Spanish' || text === 'Espagnol') {
                        span.textContent = t('spanish');
                    } else if (text === 'English' || text === 'Anglais') {
                        span.textContent = t('english');
                    } else if (text === 'French' || text === 'Français') {
                        span.textContent = t('french');
                    } else if (text === 'Portuguese' || text === 'Portugais') {
                        span.textContent = t('portuguese');
                    } else if (text === 'Italian' || text === 'Italien') {
                        span.textContent = t('italian');
                    }
                });

                document.querySelectorAll('.language-level').forEach(span => {
                    const text = span.textContent.trim();
                    if (text === 'Native' || text === 'Langue maternelle') {
                        span.textContent = t('native');
                    } else if (text === 'Fluent' || text === 'Courant') {
                        span.textContent = t('fluent');
                    }
                });

                // Update dates
                document.querySelectorAll('.date').forEach(span => {
                    const text = span.textContent;
                    if (text.includes('Present')) {
                        span.textContent = text.replace('Present', t('present'));
                    } else if (text.includes('Présent')) {
                        span.textContent = text.replace('Présent', t('present'));
                    }
                });

                // Update education content
                const educationSection = document.querySelector('#education-section ul');
                if (educationSection) {
                    const items = educationSection.querySelectorAll('li');
                    if (items[0]) items[0].textContent = t('computerScienceEngineer');
                    if (items[2]) items[2].textContent = t('specializedIn');
                    if (items[3]) items[3].textContent = t('scholarship');
                }

                // Update project cards
                document.querySelectorAll('.project-card').forEach(card => {
                    const title = card.querySelector('.project-title');
                    if (title) {
                        const icon = title.querySelector('i');
                        const iconHtml = icon ? icon.outerHTML + ' ' : '';
                        const titleText = title.textContent.trim();

                        if (titleText.includes('Dynamic Pricing') || titleText.includes('Tarification Dynamique')) {
                            title.innerHTML = iconHtml + t('dynamicPricingOptimization');
                        } else if (titleText.includes('Cloud Migration') || titleText.includes('Migration Cloud')) {
                            title.innerHTML = iconHtml + t('cloudMigrationStrategy');
                        } else if (titleText.includes('CRM Integration') || titleText.includes('Intégration CRM')) {
                            title.innerHTML = iconHtml + t('crmIntegration');
                        }
                    }

                    // Update Technologies and Impact labels
                    card.querySelectorAll('strong').forEach(strong => {
                        const text = strong.textContent;
                        if (text === 'Technologies:') {
                            strong.textContent = t('technologies') + ':';
                        } else if (text === 'Impact:') {
                            strong.textContent = t('impact') + ':';
                        }
                    });
                });

                // Update PDF loading message
                const loadingP = document.querySelector('.pdf-loading p');
                if (loadingP) {
                    loadingP.textContent = t('generatingPDF');
                }

                // Update skip link
                const skipLink = document.querySelector('.skip-link');
                if (skipLink) {
                    skipLink.textContent = t('skipToContent');
                }

                // Update links text
                document.querySelectorAll('a').forEach(link => {
                    const text = link.textContent.trim();
                    if (text === 'LinkedIn Profile' || text === 'Profil LinkedIn') {
                        link.textContent = t('linkedinProfile');
                    } else if (text === 'GitHub Profile' || text === 'Profil GitHub') {
                        link.textContent = t('githubProfile');
                    }
                });
            }

            // Initialize theme
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);

            // Handle both old and new theme toggle buttons
            const themeToggleOld = document.getElementById('theme-toggle-old');
            const themeToggle = document.getElementById('theme-toggle');

            const toggleTheme = function () {
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
        });

        // Set initial language button state
        const currentLang = getCurrentLanguage();
        languageToggle.innerHTML = currentLang === 'en'
            ? '<i class="fas fa-globe"></i> FR'
            : '<i class="fas fa-globe"></i> EN';
    }

    // Handle both print buttons
    const printButton = document.getElementById('print-btn');
    const printCvButton = document.getElementById('print-cv');

    const printCV = function () {
        window.print();
    };

    if (printButton) printButton.addEventListener('click', printCV);
    if (printCvButton) printCvButton.addEventListener('click', printCV);

    // PDF generation using pdfmake and dom-to-image
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadPdfOldButton = document.getElementById('download-pdf-old');

    const downloadPdf = async function () {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'pdf-loading';
        loadingIndicator.innerHTML = `<div class="spinner"></div><p>${t('generatingPDF')}</p>`;
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
                pageSize: 'LETTER',
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
                    img.onload = function () {
                        // Calculate dimensions
                        const imgWidth = docDefinition.pageSize.width - (docDefinition.pageMargins[0] + docDefinition.pageMargins[2]);
                        const imgHeight = img.height * (imgWidth / img.width);

                        // US Letter height is 792pt. Margins 20+20=40. Usable approx 752.
                        // We use 750 to be safe.
                        const pageHeight = 750;

                        // Add image to the PDF content
                        docDefinition.content.push({
                            image: dataUrl,
                            width: imgWidth,
                            // Only show part of the image on first page
                            fit: [imgWidth, pageHeight]
                        });

                        // If image is larger than page height, add more pages
                        // Note: This simple slicing might cut text in half. 
                        // Browser Print (Ctrl+P) is recommended for better text handling.
                        if (imgHeight > pageHeight) {
                            docDefinition.content.push({
                                image: dataUrl,
                                width: imgWidth,
                                pageBreak: 'before',
                                // Position and crop image for second page
                                fit: [imgWidth, pageHeight],
                                margin: [0, -pageHeight, 0, 0] // Move image up
                            });
                        }

                        resolve();
                    };

                    img.onerror = function () {
                        // Fallback if image loading fails
                        docDefinition.content.push({
                            text: 'Failed to load CV image',
                            style: 'header'
                        });
                        resolve();
                    };
                });

                // Create and download the PDF
                const lang = getCurrentLanguage();
                const filename = lang === 'fr'
                    ? "Mauricio_Inocencio_CV_FR.pdf"
                    : "Mauricio_Inocencio_CV.pdf";
                pdfMake.createPdf(docDefinition).download(filename);

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
            alert(t('pdfError'));
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
    document.addEventListener('keydown', function (e) {
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

        // Alt+L for toggle language
        if (e.altKey && e.key === 'l') {
            e.preventDefault();
            if (languageToggle) {
                languageToggle.click();
            }
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
        skipLink.addEventListener('click', function (e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        });
    }

    // Initial page language update
    updatePageLanguage();

    // Check URL parameters for language
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && (langParam === 'en' || langParam === 'fr')) {
        setLanguage(langParam);
        updatePageLanguage();
        if (languageToggle) {
            languageToggle.innerHTML = langParam === 'en'
                ? '<i class="fas fa-globe"></i> FR'
                : '<i class="fas fa-globe"></i> EN';
        }
    }
});
