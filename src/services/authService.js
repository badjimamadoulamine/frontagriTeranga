import api from './api'

const authService = {
  // Inscription
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Vérification email (LOGIQUE CORRIGÉE pour sessions SIMULTANÉES)
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`)
    const apiUser = response.data?.data?.user || response.data?.user
    const apiToken = response.data?.token
    if (apiToken && apiUser) {
      const isAdmin = apiUser?.role === 'admin' || apiUser?.isSuperAdmin === true
      const role = apiUser?.role

      if (isAdmin) {
        // Admin: DÉFINIT UNIQUEMENT les clés de l'Admin. Ne touche PAS aux autres.
        localStorage.setItem('adminDashboardToken', apiToken)
        localStorage.setItem('adminDashboardUser', JSON.stringify(apiUser))
      } else if (role === 'producteur') {
        // Producteur: DÉFINIT UNIQUEMENT les clés du Producteur. Ne touche PAS aux autres.
        localStorage.setItem('producerDashboardToken', apiToken)
        localStorage.setItem('producerDashboardUser', JSON.stringify(apiUser))
      } else if (role === 'livreur') {
        // Livreur: DÉFINIT UNIQUEMENT les clés du Livreur. Ne touche PAS aux autres.
        localStorage.setItem('deliveryDashboardToken', apiToken)
        localStorage.setItem('deliveryDashboardUser', JSON.stringify(apiUser))
      } else {
        // Utilisateur public (Consommateur): DÉFINIT UNIQUEMENT les clés génériques. Ne touche PAS aux autres.
        localStorage.setItem('token', apiToken)
        localStorage.setItem('user', JSON.stringify(apiUser))
      }
      // Note: Aucun removeItem des clés génériques n'est nécessaire ici.
      try { window.dispatchEvent(new Event('auth-changed')) } catch {}
    }
    return response.data
  },

  // Connexion (LOGIQUE CORRIGÉE pour sessions SIMULTANÉES)
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    const apiUser = response.data?.data?.user || response.data?.user
    const apiToken = response.data?.token
    if (apiToken && apiUser) {
      const isAdmin = apiUser?.role === 'admin' || apiUser?.isSuperAdmin === true
      const role = apiUser?.role

      if (isAdmin) {
        // Admin: DÉFINIT UNIQUEMENT les clés de l'Admin.
        localStorage.setItem('adminDashboardToken', apiToken)
        localStorage.setItem('adminDashboardUser', JSON.stringify(apiUser))
      } else if (role === 'producteur') {
        // Producteur: DÉFINIT UNIQUEMENT les clés du Producteur.
        localStorage.setItem('producerDashboardToken', apiToken)
        localStorage.setItem('producerDashboardUser', JSON.stringify(apiUser))
      } else if (role === 'livreur') {
        // Livreur: DÉFINIT UNIQUEMENT les clés du Livreur.
        localStorage.setItem('deliveryDashboardToken', apiToken)
        localStorage.setItem('deliveryDashboardUser', JSON.stringify(apiUser))
      } else {
        // Utilisateur public (Consommateur): DÉFINIT UNIQUEMENT les clés génériques.
        localStorage.setItem('token', apiToken)
        localStorage.setItem('user', JSON.stringify(apiUser))
      }
      // Note: Aucun removeItem des clés génériques n'est nécessaire ici.
      try { window.dispatchEvent(new Event('auth-changed')) } catch {}
    }
    return response.data
  },

  // Déconnexion
  logout: () => {
    try {
      // Suppression des tokens et utilisateurs pour TOUS les rôles
      const keysToRemove = [
        'token', 'user', // Clés du consommateur
        'adminDashboardToken', 'adminDashboardUser',
        'producerDashboardToken', 'producerDashboardUser',
        'deliveryDashboardToken', 'deliveryDashboardUser'
      ]
      keysToRemove.forEach(key => localStorage.removeItem(key))

      // Notifier les autres composants que l’état d’auth a changé
      window.dispatchEvent(new Event('auth-changed'))
    } catch (err) {
      console.error('Erreur pendant la déconnexion :', err)
    }

    // Redirection vers la page de connexion
    window.location.href = '/login'
  },

  // Récupérer l'utilisateur connecté (Consommateur)
  getCurrentUser: () => {
    const userString = localStorage.getItem('user')
    if (!userString || userString === 'undefined' || userString === 'null') {
      return null
    }
    try {
      return JSON.parse(userString)
    } catch (error) {
      // En cas d'erreur de parsing, nettoyer le localStorage corrompu
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return null
    }
  },

  // Vérifier si l'utilisateur est connecté (Consommateur)
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
}

export default authService