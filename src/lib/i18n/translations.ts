export const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.courses': 'Courses',
    'nav.quizzes': 'Quizzes',
    'nav.certificates': 'Certificates',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Employee Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.stats.enrollments': 'Courses Enrolled',
    'dashboard.stats.completed': 'completed',
    'dashboard.stats.quizzes': 'Quizzes Taken',
    'dashboard.stats.avgScore': 'avg score',
    'dashboard.stats.timeSpent': 'Time Spent',
    'dashboard.stats.certificates': 'Certificates',
    'dashboard.stats.earned': 'Earned',
    
    // Courses
    'courses.title': 'Available Courses',
    'courses.browse': 'Browse Available Courses',
    'courses.enroll': 'Enroll Now',
    'courses.continue': 'Continue',
    'courses.completed': 'Completed',
    'courses.progress': 'Progress',
    
    // Quizzes
    'quiz.title': 'Quiz',
    'quiz.question': 'Question',
    'quiz.of': 'of',
    'quiz.timeRemaining': 'Time Remaining',
    'quiz.submit': 'Submit Quiz',
    'quiz.previous': 'Previous',
    'quiz.next': 'Next',
    'quiz.results': 'Quiz Results',
    'quiz.score': 'Your Score',
    'quiz.passed': 'Congratulations! You passed!',
    'quiz.failed': "You didn't pass this time, but you can try again.",
    'quiz.tryAgain': 'Try Again',
    
    // Certificates
    'certificates.title': 'My Certificates',
    'certificates.view': 'View Certificate',
    'certificates.download': 'Download',
    'certificates.verify': 'Verify Certificate',
    'certificates.none': 'No Certificates Yet',
    'certificates.earnMore': 'Complete courses and pass quizzes to earn certificates',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.courses': 'Cours',
    'nav.quizzes': 'Quiz',
    'nav.certificates': 'Certificats',
    'nav.profile': 'Profil',
    'nav.logout': 'Déconnexion',
    
    // Dashboard
    'dashboard.title': 'Tableau de bord employé',
    'dashboard.welcome': 'Bienvenue',
    'dashboard.stats.enrollments': 'Cours inscrits',
    'dashboard.stats.completed': 'terminé',
    'dashboard.stats.quizzes': 'Quiz effectués',
    'dashboard.stats.avgScore': 'score moyen',
    'dashboard.stats.timeSpent': 'Temps passé',
    'dashboard.stats.certificates': 'Certificats',
    'dashboard.stats.earned': 'Gagnés',
    
    // Courses
    'courses.title': 'Cours disponibles',
    'courses.browse': 'Parcourir les cours disponibles',
    'courses.enroll': "S'inscrire maintenant",
    'courses.continue': 'Continuer',
    'courses.completed': 'Terminé',
    'courses.progress': 'Progrès',
    
    // Quizzes
    'quiz.title': 'Quiz',
    'quiz.question': 'Question',
    'quiz.of': 'sur',
    'quiz.timeRemaining': 'Temps restant',
    'quiz.submit': 'Soumettre le quiz',
    'quiz.previous': 'Précédent',
    'quiz.next': 'Suivant',
    'quiz.results': 'Résultats du quiz',
    'quiz.score': 'Votre score',
    'quiz.passed': 'Félicitations ! Vous avez réussi !',
    'quiz.failed': "Vous n'avez pas réussi cette fois, mais vous pouvez réessayer.",
    'quiz.tryAgain': 'Réessayer',
    
    // Certificates
    'certificates.title': 'Mes certificats',
    'certificates.view': 'Voir le certificat',
    'certificates.download': 'Télécharger',
    'certificates.verify': 'Vérifier le certificat',
    'certificates.none': 'Aucun certificat pour le moment',
    'certificates.earnMore': 'Terminez des cours et réussissez des quiz pour obtenir des certificats',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.back': 'Retour',
    'common.close': 'Fermer',
    'common.yes': 'Oui',
    'common.no': 'Non',
  }
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en