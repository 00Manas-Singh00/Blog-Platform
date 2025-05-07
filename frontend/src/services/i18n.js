// Simple i18n implementation for multi-language support

// Translation dictionaries
const translations = {
  en: {
    // Common
    'app.title': 'Blog Platform',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.delete': 'Delete',
    'button.edit': 'Edit',
    
    // Navigation
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.myPosts': 'My Posts',
    'nav.createPost': 'Create Post',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.edit': 'Edit Profile',
    'profile.bio': 'Bio',
    'profile.website': 'Website',
    'profile.socialLinks': 'Social Links',
    'profile.noBio': 'No bio provided yet.',
    'profile.noWebsite': 'No website provided yet.',
    'profile.noSocialLinks': 'No social links provided yet.',
    
    // Settings tabs
    'settings.profile': 'Profile',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.account': 'Account Settings',
    
    // Account settings
    'account.preferences': 'Preferences',
    'account.language': 'Language',
    'account.theme': 'Theme',
    'account.autoSave': 'Auto-save draft posts',
    'account.security': 'Security',
    'account.twoFactor': 'Enable two-factor authentication',
    'account.twoFactorDetails': 'Two-factor authentication provides an extra layer of security for your account.',
    'account.setupTwoFactor': 'Set up Two-Factor Authentication',
    'account.changePassword': 'Change Password',
    'account.dataManagement': 'Data Management',
    'account.exportData': 'Export your data',
    'account.exportDataDesc': 'Download a copy of all your content and data',
    'account.deleteAccount': 'Delete account',
    'account.deleteAccountDesc': 'Permanently delete your account and all your data',
    
    // Delete account
    'delete.title': 'Delete Your Account',
    'delete.warning': 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.',
    'delete.whatDeleted': 'What will be deleted:',
    'delete.item1': 'All your blog posts and drafts',
    'delete.item2': 'All your comments and replies',
    'delete.item3': 'Your personal information and profile',
    'delete.item4': 'Your notification and privacy settings',
    'delete.typeDelete': 'Please type DELETE to confirm:',
    'delete.understand': 'I understand that this action is permanent and cannot be undone',
    'delete.confirmButton': 'Permanently Delete Account',
  },
  
  es: {
    // Common
    'app.title': 'Plataforma de Blog',
    'button.save': 'Guardar',
    'button.cancel': 'Cancelar',
    'button.delete': 'Eliminar',
    'button.edit': 'Editar',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.categories': 'Categorías',
    'nav.myPosts': 'Mis Publicaciones',
    'nav.createPost': 'Crear Publicación',
    'nav.profile': 'Perfil',
    'nav.admin': 'Administrador',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    
    // Profile
    'profile.title': 'Mi Perfil',
    'profile.edit': 'Editar Perfil',
    'profile.bio': 'Biografía',
    'profile.website': 'Sitio Web',
    'profile.socialLinks': 'Redes Sociales',
    'profile.noBio': 'Aún no hay biografía.',
    'profile.noWebsite': 'Aún no hay sitio web.',
    'profile.noSocialLinks': 'Aún no hay redes sociales.',
    
    // Settings tabs
    'settings.profile': 'Perfil',
    'settings.notifications': 'Notificaciones',
    'settings.privacy': 'Privacidad',
    'settings.account': 'Configuración de Cuenta',
    
    // Account settings
    'account.preferences': 'Preferencias',
    'account.language': 'Idioma',
    'account.theme': 'Tema',
    'account.autoSave': 'Guardar borradores automáticamente',
    'account.security': 'Seguridad',
    'account.twoFactor': 'Habilitar autenticación de dos factores',
    'account.twoFactorDetails': 'La autenticación de dos factores proporciona una capa adicional de seguridad para tu cuenta.',
    'account.setupTwoFactor': 'Configurar Autenticación de Dos Factores',
    'account.changePassword': 'Cambiar Contraseña',
    'account.dataManagement': 'Gestión de Datos',
    'account.exportData': 'Exportar tus datos',
    'account.exportDataDesc': 'Descargar una copia de todo tu contenido y datos',
    'account.deleteAccount': 'Eliminar cuenta',
    'account.deleteAccountDesc': 'Eliminar permanentemente tu cuenta y todos tus datos',
    
    // Delete account
    'delete.title': 'Eliminar Tu Cuenta',
    'delete.warning': 'Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos de nuestros servidores.',
    'delete.whatDeleted': 'Qué se eliminará:',
    'delete.item1': 'Todas tus publicaciones y borradores',
    'delete.item2': 'Todos tus comentarios y respuestas',
    'delete.item3': 'Tu información personal y perfil',
    'delete.item4': 'Tus configuraciones de notificaciones y privacidad',
    'delete.typeDelete': 'Por favor escribe DELETE para confirmar:',
    'delete.understand': 'Entiendo que esta acción es permanente y no se puede deshacer',
    'delete.confirmButton': 'Eliminar Cuenta Permanentemente',
  },
  
  fr: {
    // Common
    'app.title': 'Plateforme de Blog',
    'button.save': 'Enregistrer',
    'button.cancel': 'Annuler',
    'button.delete': 'Supprimer',
    'button.edit': 'Modifier',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.categories': 'Catégories',
    'nav.myPosts': 'Mes Articles',
    'nav.createPost': 'Créer un Article',
    'nav.profile': 'Profil',
    'nav.admin': 'Admin',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    
    // Add more translations as needed
  },
  
  de: {
    // Common
    'app.title': 'Blog-Plattform',
    'button.save': 'Speichern',
    'button.cancel': 'Abbrechen',
    'button.delete': 'Löschen',
    'button.edit': 'Bearbeiten',
    
    // Navigation
    'nav.home': 'Startseite',
    'nav.categories': 'Kategorien',
    'nav.myPosts': 'Meine Beiträge',
    'nav.createPost': 'Beitrag erstellen',
    'nav.profile': 'Profil',
    'nav.admin': 'Admin',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    
    // Add more translations as needed
  }
};

// Default language
let currentLanguage = 'en';

// Get user's preferred language from localStorage or browser settings
const initLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
  } else {
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      currentLanguage = browserLang;
    }
  }
};

// Initialize language
initLanguage();

// Translation function
export const t = (key, replacements = {}) => {
  // Get the translation for the key in the current language
  let translation = translations[currentLanguage][key] || translations.en[key] || key;
  
  // Replace any placeholders
  Object.keys(replacements).forEach(placeholder => {
    translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  
  return translation;
};

// Change language function
export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Dispatch event so components can update
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
    
    return true;
  }
  return false;
};

// Get current language
export const getLanguage = () => currentLanguage;

// Get available languages
export const getAvailableLanguages = () => Object.keys(translations);

export default {
  t,
  setLanguage,
  getLanguage,
  getAvailableLanguages
}; 