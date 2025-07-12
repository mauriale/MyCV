// Translations for the CV website
const translations = {
    en: {
        // Header
        jobTitle: "Senior Project Manager & LEAN Portfolio Manager",
        phone: "+33 7 81 72 26 80",
        location: "Nice, France",
        linkedinProfile: "LinkedIn Profile",
        githubProfile: "GitHub Profile",
        
        // Action buttons
        downloadPDF: "Download CV as PDF",
        printCV: "Print CV",
        toggleTheme: "Toggle dark/light mode",
        changeLanguage: "Change language",
        
        // Section titles
        skills: "SKILLS",
        functionalSkills: "Functional Skills",
        technicalSkills: "Technical Skills",
        personalSkills: "Personal Skills",
        languages: "LANGUAGES",
        education: "EDUCATION",
        certifications: "CERTIFICATIONS",
        additionalActivities: "ADDITIONAL ACTIVITIES",
        professionalSummary: "PROFESSIONAL SUMMARY",
        featuredProjects: "FEATURED PROJECTS",
        professionalExperience: "PROFESSIONAL EXPERIENCE",
        
        // Languages section
        spanish: "Spanish",
        english: "English",
        french: "French",
        portuguese: "Portuguese",
        italian: "Italian",
        native: "Native",
        fluent: "Fluent",
        
        // Education
        computerScienceEngineer: "Computer Science Engineer (BAC+5)",
        specializedIn: "Specialized in Distributed Systems and Project Management",
        scholarship: "Recipient of the prestigious \"President of the Republic\" scholarship",
        
        // Activities
        sports: "Sports",
        interests: "Interests",
        
        // Professional Summary
        professionalSummaryText: "Results-driven Senior Project Manager and LEAN Portfolio Manager with extensive expertise in the travel industry. Adept at leveraging strategic project management methodologies, business process optimization, and transformational change management to deliver operational excellence and high-value solutions. Proven track record of successfully aligning technical implementations with business objectives across multinational environments.",
        
        // Featured Projects
        dynamicPricingOptimization: "Dynamic Pricing Optimization",
        cloudMigrationStrategy: "Cloud Migration Strategy",
        crmIntegration: "CRM Integration for Airline Loyalty",
        technologies: "Technologies",
        impact: "Impact",
        
        // Experience dates
        present: "Present",
        
        // Job titles
        serviceDeliveryManager: "Service Delivery Manager",
        leanPortfolioManager: "DWS Lean Portfolio Manager",
        seniorProjectManager: "Senior Project Manager",
        airlineBusinessConsultant: "Airline Business Consultant",
        projectPortfolioManager: "Project Portfolio Manager - RMS / Pricing / Loyalty",
        
        // PDF generation
        generatingPDF: "Generating PDF...",
        pdfError: "There was a problem generating the PDF. Please try using the browser's print function.",
        
        // Skip link
        skipToContent: "Skip to main content"
    },
    fr: {
        // Header
        jobTitle: "Chef de Projet SI Senior - Spécialiste Transformation Digitale Finance",
        phone: "+33 7 81 72 26 80",
        location: "Nice, France",
        linkedinProfile: "Profil LinkedIn",
        githubProfile: "Profil GitHub",
        
        // Action buttons
        downloadPDF: "Télécharger le CV en PDF",
        printCV: "Imprimer le CV",
        toggleTheme: "Basculer mode sombre/clair",
        changeLanguage: "Changer de langue",
        
        // Section titles
        skills: "COMPÉTENCES",
        functionalSkills: "Compétences Fonctionnelles",
        technicalSkills: "Compétences Techniques",
        personalSkills: "Compétences Personnelles",
        languages: "LANGUES",
        education: "FORMATION",
        certifications: "CERTIFICATIONS",
        additionalActivities: "ACTIVITÉS COMPLÉMENTAIRES",
        professionalSummary: "RÉSUMÉ PROFESSIONNEL",
        featuredProjects: "PROJETS PHARES",
        professionalExperience: "EXPÉRIENCE PROFESSIONNELLE",
        
        // Languages section
        spanish: "Espagnol",
        english: "Anglais",
        french: "Français",
        portuguese: "Portugais",
        italian: "Italien",
        native: "Langue maternelle",
        fluent: "Courant",
        
        // Education
        computerScienceEngineer: "Ingénieur Informatique (BAC+5)",
        specializedIn: "Spécialisé en Systèmes Distribués et Gestion de Projets",
        scholarship: "Bénéficiaire de la prestigieuse bourse \"Président de la République\"",
        
        // Activities
        sports: "Sports",
        interests: "Intérêts",
        
        // Professional Summary
        professionalSummaryText: "Chef de Projet SI Senior avec plus de 15 ans d'expérience dans la transformation digitale et l'optimisation des processus métiers. Expert en gestion de projets complexes d'intégration de systèmes d'information, avec une forte orientation sur les processus financiers, la sécurité des données et l'innovation technologique (IA, automatisation, RPA). Reconnu pour sa capacité à aligner les implémentations techniques avec les objectifs stratégiques, tout en pilotant le changement organisationnel dans des environnements multinationaux.",
        
        // Featured Projects
        dynamicPricingOptimization: "Optimisation des Processus Financiers et Tarification Dynamique",
        cloudMigrationStrategy: "Migration Cloud et Modernisation des SI",
        crmIntegration: "Intégration ERP et Systèmes de Gestion Client",
        technologies: "Technologies",
        impact: "Impact",
        
        // Experience dates
        present: "Présent",
        
        // Job titles
        serviceDeliveryManager: "Service Delivery Manager - Transformation Digitale",
        leanPortfolioManager: "DWS Lean Portfolio Manager",
        seniorProjectManager: "Chef de Projet Senior SI",
        airlineBusinessConsultant: "Consultant Business - Systèmes d'Information",
        projectPortfolioManager: "Gestionnaire de Portefeuille de Projets - Systèmes Financiers",
        
        // PDF generation
        generatingPDF: "Génération du PDF...",
        pdfError: "Un problème est survenu lors de la génération du PDF. Veuillez essayer d'utiliser la fonction d'impression du navigateur.",
        
        // Skip link
        skipToContent: "Aller au contenu principal"
    }
};

// Function to get current language
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
}

// Function to set language
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
}

// Function to get translation
function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang][key] || translations.en[key] || key;
}

// Export for use in other scripts
window.translations = translations;
window.getCurrentLanguage = getCurrentLanguage;
window.setLanguage = setLanguage;
window.t = t;
