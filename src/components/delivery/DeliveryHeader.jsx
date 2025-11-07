import React, { useEffect, useState, useCallback } from 'react';
import { Bell, LogOut, User, Settings, X, Camera, Loader, Package, Clock, CheckCircle, MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfilePictureUrl } from '../../utils/imageUtils';
import apiService from '../../services/apiService';
import authService from '../../services/authService';

const DeliveryHeader = ({ onLogout }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // États pour les notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [lastCheck, setLastCheck] = useState(Date.now());

  // États pour le formulaire de profil
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: null
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState('');

  // États pour le changement de mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Charger le profil depuis l'API
  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyProfile();
      
      if (response.status === 'success' && response.data) {
        const userData = response.data.user || response.data;
        setProfile(userData);
        
        setProfileForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          profilePicture: null
        });

        const base = userData.profilePicture ? getProfilePictureUrl(userData.profilePicture) : '';
        const url = base ? `${base}${base.includes('?') ? '&' : '?'}v=${Date.now()}` : '';
        setAvatarUrl(url);
        setProfilePicturePreview(url);

        const name = (userData.firstName || '') + ' ' + (userData.lastName || '');
        const cleaned = name.trim();
        setDisplayName(cleaned || userData.name || 'Livreur');

        localStorage.setItem('deliveryDashboardUser', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications de nouvelles commandes
  const loadNotifications = useCallback(async (showToast = false) => {
    try {
      setLoadingNotifications(true);
      
      // Récupérer les livraisons disponibles (nouvelles commandes)
      const response = await apiService.getAvailableDeliveries(1, 20);
      
      if (response.status === 'success' && response.data) {
        const deliveries = response.data.deliveries || response.data.docs || [];
        
        // Transformer les livraisons en notifications
        const newNotifications = deliveries.map(delivery => {
          const orderId = delivery.order?._id || delivery.orderId || delivery._id;
          const orderNumber = delivery.order?.orderNumber || delivery.orderNumber || orderId?.slice(-6);
          const customerName = delivery.order?.customer 
            ? `${delivery.order.customer.firstName || ''} ${delivery.order.customer.lastName || ''}`.trim()
            : 'Client';
          const city = delivery.deliveryAddress?.city || delivery.order?.deliveryAddress?.city || 'Non spécifié';
          const district = delivery.deliveryAddress?.district || delivery.order?.deliveryAddress?.district || '';
          const amount = delivery.order?.totalAmount || delivery.totalAmount || 0;
          
          return {
            id: delivery._id,
            type: 'new_order',
            title: 'Nouvelle commande disponible',
            message: `Commande #${orderNumber}`,
            customerName,
            location: district ? `${district}, ${city}` : city,
            amount: `${amount.toLocaleString()} CFA`,
            timestamp: delivery.createdAt || delivery.order?.createdAt || new Date().toISOString(),
            isRead: false,
            data: delivery,
            priority: delivery.priority || 'normal'
          };
        });

        // Vérifier s'il y a de nouvelles notifications
        const previousIds = new Set(notifications.map(n => n.id));
        const hasNewNotifications = newNotifications.some(n => !previousIds.has(n.id));

        if (hasNewNotifications && showToast && notifications.length > 0) {
          const newCount = newNotifications.filter(n => !previousIds.has(n.id)).length;
          toast.info(`🔔 ${newCount} nouvelle${newCount > 1 ? 's' : ''} commande${newCount > 1 ? 's' : ''} disponible${newCount > 1 ? 's' : ''} !`, {
            position: "top-right",
            autoClose: 5000,
            onClick: () => {
              setShowNotifications(true);
            }
          });
        }

        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter(n => !n.isRead).length);
        setLastCheck(Date.now());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      // Ne pas afficher d'erreur pour ne pas perturber l'expérience utilisateur
    } finally {
      setLoadingNotifications(false);
    }
  }, [notifications]);

  // Marquer une notification comme lue
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  };

  // Gérer le clic sur une notification
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    
    // Naviguer vers la page des livraisons disponibles ou détails
    if (notification.data) {
      navigate('/delivery/available', { state: { highlightId: notification.id } });
    }
  };

  // Formater le temps écoulé
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notifTime) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
  };

  // Effet initial : charger profil et notifications
  useEffect(() => {
    loadProfile();
    loadNotifications(false);
  }, []);

  // Actualiser les notifications périodiquement
  useEffect(() => {
    // Actualiser toutes les 15 secondes
    const interval = setInterval(() => {
      loadNotifications(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Mettre à jour l'avatar et le nom d'affichage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('deliveryDashboardUser') || localStorage.getItem('user');
      const latest = raw ? JSON.parse(raw) : profile;
      const base = latest?.profilePicture ? getProfilePictureUrl(latest.profilePicture) : '';
      const url = base ? `${base}${base.includes('?') ? '&' : '?'}v=${Date.now()}` : '';
      setAvatarUrl(url);
      const name = (latest?.firstName || latest?.first_name || latest?.prenom || '')
        + ' ' + (latest?.lastName || latest?.last_name || latest?.nom || '');
      const cleaned = name.trim();
      setDisplayName(cleaned || latest?.name || 'Livreur');
    } catch {
      const base = profile?.profilePicture ? getProfilePictureUrl(profile.profilePicture) : '';
      const url = base ? `${base}${base.includes('?') ? '&' : '?'}v=${Date.now()}` : '';
      setAvatarUrl(url);
      const name = (profile?.firstName || '') + ' ' + (profile?.lastName || '');
      const cleaned = name.trim();
      setDisplayName(cleaned || profile?.name || 'Livreur');
    }
  }, [profile]);

  const handleLogout = () => {
    try { if (onLogout) onLogout(); } catch {}
    authService.logout();
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La taille de l\'image ne doit pas dépasser 5 Mo');
        return;
      }

      setProfileForm({ ...profileForm, profilePicture: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('firstName', profileForm.firstName);
      formData.append('lastName', profileForm.lastName);
      formData.append('email', profileForm.email);
      formData.append('phone', profileForm.phone);
      if (profileForm.address) {
        formData.append('address', profileForm.address);
      }
      if (profileForm.profilePicture) {
        formData.append('profilePicture', profileForm.profilePicture);
      }

      const response = await apiService.updateProfile(formData);
      
      if (response.status === 'success') {
        toast.success('Profil mis à jour avec succès');
        await loadProfile();
        setShowProfileModal(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setLoading(true);

      const response = await apiService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      if (response.status === 'success') {
        toast.success('Mot de passe modifié avec succès');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowProfileModal(false);
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast.error(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-end gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-green-600 animate-pulse' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-14 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Notifications
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Dernière mise à jour: {formatTimeAgo(lastCheck)}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                    >
                      Tout marquer
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 text-green-600 animate-spin" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Package className="w-10 h-10 text-gray-300" />
                      </div>
                      <p className="text-gray-700 font-medium">Aucune commande disponible</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Les nouvelles commandes apparaîtront ici
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                            !notification.isRead ? 'bg-green-50 border-l-4 border-green-500' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className={`p-2.5 rounded-full flex-shrink-0 ${
                              !notification.isRead 
                                ? 'bg-green-100' 
                                : 'bg-gray-100'
                            }`}>
                              <Package className={`w-5 h-5 ${
                                !notification.isRead ? 'text-green-600' : 'text-gray-600'
                              }`} />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-semibold ${
                                  !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <span className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-1.5"></span>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-800 font-medium mt-1">
                                {notification.message}
                              </p>
                              
                              {/* Customer & Location */}
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <User className="w-3.5 h-3.5" />
                                  <span>{notification.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{notification.location}</span>
                                </div>
                              </div>

                              {/* Amount & Time */}
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                <span className="text-sm font-semibold text-green-600">
                                  {notification.amount}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimeAgo(notification.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/delivery/available');
                    }}
                    className="w-full text-sm text-green-600 hover:text-green-700 font-medium text-center py-2 rounded-md hover:bg-green-50 transition-colors"
                  >
                    Voir toutes les commandes disponibles →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {displayName || 'Livreur'}
              </p>
              <p className="text-xs text-gray-500">Livreur</p>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="relative group"
              >
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-green-700 transition-colors ring-2 ring-white shadow-lg group-hover:ring-green-400">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-gray-50">
                  <Settings className="w-3 h-3 text-gray-600 group-hover:text-gray-800" />
                </div>
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-14 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Mon profil
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmer la déconnexion</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de profil avec scroll */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header du modal - fixe */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Mon Profil</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Navigation par onglets - fixe */}
            <div className="border-b border-gray-200 px-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Informations personnelles
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'password'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sécurité
                </button>
              </nav>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Onglet Profil */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Photo de profil */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profilePicturePreview ? (
                          <img
                            src={profilePicturePreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <label
                        htmlFor="profile-picture"
                        className="absolute bottom-0 right-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors shadow-lg"
                      >
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureChange}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Cliquez sur l'icône pour changer votre photo
                    </p>
                  </div>

                  {/* Informations personnelles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <textarea
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="Votre adresse complète"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading && <Loader className="w-4 h-4 animate-spin" />}
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {/* Onglet Mot de passe */}
              {activeTab === 'password' && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 6 caractères
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading && <Loader className="w-4 h-4 animate-spin" />}
                      Changer le mot de passe
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryHeader;