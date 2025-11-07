import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCartOperations } from '../hooks/useCartOperations';
import apiService from '../services/apiService';
import { getProductImageUrl } from '../utils/imageUtils';

const ProductDetail = ({ onOpenRegister, onOpenLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddToCart } = useCartOperations();

  // Données du produit depuis l'API
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await apiService.getProductDetails(id);
        const payload = resp || {};
        const p = (payload.data && (payload.data.product || payload.data)) || payload.product || payload;
        if (mounted) setProduct(p || null);
      } catch (e) {
        if (mounted) {
          setError(e?.message || 'Erreur de chargement du produit');
          setProduct(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  // Produits similaires (dynamiques)
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState(null);

  useEffect(() => {
    const loadSimilar = async () => {
      try {
        setSimilarError(null);
        setSimilarLoading(true);
        if (!product || !product.category) {
          setSimilarProducts([]);
          return;
        }
        const resp = await apiService.getProducts({ category: product.category, limit: 8, sort: '-createdAt' });
        const payload = resp || {};
        const list = (payload.data && (payload.data.products || payload.data)) || payload.products || [];
        const currentId = product._id || product.id;
        const filtered = (Array.isArray(list) ? list : [])
          .filter(p => (p._id || p.id) !== currentId)
          .slice(0, 4);
        setSimilarProducts(filtered);
      } catch (e) {
        setSimilarError(e?.message || 'Erreur de chargement des produits similaires');
        setSimilarProducts([]);
      } finally {
        setSimilarLoading(false);
      }
    };
    loadSimilar();
  }, [product?.category, product?._id, product?.id]);

  // Helpers d'affichage
  const imgSrc = getProductImageUrl(product);

  const producerName = product && (product.seller
    || product.producerName
    || (product.producer && [product.producer.firstName, product.producer.lastName].filter(Boolean).join(' '))
  );

  // Infos producteur depuis la base (champ producteurInfo côté User)
  const pInfo = product?.producer?.producteurInfo || null;
  const cultureType = pInfo?.cultureType || null;
  const hasCertificates = Array.isArray(pInfo?.certificates) && pInfo.certificates.length > 0;
  const localisation = pInfo?.region || null;

  const handleAddToCartClick = () => {
    if (!product) return;
    const cartProduct = {
      id: product._id || product.id,
      nom: product.name,
      prix: product.price,
      unite: product.unit,
      image: getProductImageUrl(product)
    };
    handleAddToCart(cartProduct);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const fillPercent = i < 4 ? 100 : i === 4 ? 50 : 0;
      stars.push(
        <span key={i} className="relative inline-block w-5 h-5 align-middle">
          <svg className="absolute inset-0 w-5 h-5 text-gray-300" viewBox="0 0 20 20" aria-hidden="true">
            <path fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
            <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 20 20" aria-hidden="true">
              <path fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Header global */}
      <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
      
      {/* Section principale du produit */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Image du produit - Colonne gauche */}
            <div className="order-1">
              <div className="relative">
                <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                  {loading ? (
                    <div className="w-full h-96 flex items-center justify-center text-gray-500">Chargement...</div>
                  ) : error ? (
                    <div className="w-full h-96 flex items-center justify-center text-red-600">{error}</div>
                  ) : imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={product?.name || ''}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                      <span className="text-4xl text-gray-400">—</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Détails du produit - Colonne droite */}
            <div className="order-2 lg:pl-8">
              <div className="space-y-6">
                {/* Nom du produit */}
                <h1 className="text-4xl font-bold text-gray-800">{product?.name || (loading ? '...' : '—')}</h1>
                
                {/* Prix */}
                <p className="text-2xl font-semibold text-gray-800">
                  {product ? (
                    <>
                      {typeof product.price === 'number' ? `${product.price} CFA` : (product.price || '-')}
                      {product.unit ? ` / ${product.unit}` : ''}
                    </>
                  ) : '—'}
                </p>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {product?.description || (loading ? '...' : '—')}
                </p>
                
                {/* Vendeur */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Vendu par:</span>
                  <span className="font-semibold text-gray-800">{producerName || (loading ? '...' : '—')}</span>
                </div>
                
                {/* Évaluation */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">{renderStars()}</div>
                  <span className="text-gray-600">4.5 / 5</span>
                </div>
                
                {/* Bouton Ajouter au panier */}
                <button
                  onClick={handleAddToCartClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 21H3m4 0v1a1 1 0 011 1v1m0 0a1 1 0 001-1v-1m0 0a1 1 0 00-1 1v1m8-2a1 1 0 011 1v1m0 0a1 1 0 001 1v-1m0 0a1 1 0 00-1-1v-1" />
                  </svg>
                  <span>Ajouter au panier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section informations sur le producteur */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Informations sur le producteur</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-36">
            {/* Nom */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Nom</h3>
                <p className="text-gray-600">{producerName || '—'}</p>
              </div>
            </div>
            
            {/* Type de culture */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Type de culture</h3>
                <p className="text-gray-600">{cultureType || '—'}</p>
              </div>
            </div>
            
            {/* Certification */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Certification</h3>
                <p className="text-gray-600">{hasCertificates ? 'Oui' : 'Non'}</p>
              </div>
            </div>
           
          </div>
        </div>
      </section>

      {/* Section produits similaires */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Produits similaires</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarLoading && (
              <div className="col-span-4 text-gray-500">Chargement...</div>
            )}
            {similarError && !similarLoading && (
              <div className="col-span-4 text-red-600">{similarError}</div>
            )}
            {!similarLoading && !similarError && similarProducts.map((sp) => {
              const sid = sp._id || sp.id;
              const sname = sp.name;
              const sprice = sp.price;
              const sunit = sp.unit;
              const simg = getProductImageUrl(sp);
              return (
                <Link
                  key={sid}
                  to={`/produit/${sid}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image du produit */}
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                    {simg ? (
                      <img src={simg} alt={sname} className="w-full h-48 object-cover" />
                    ) : (
                      <span className="text-4xl text-gray-300">—</span>
                    )}
                  </div>
                  
                  {/* Informations du produit */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{sname}</h3>
                    <p className="text-gray-800 font-semibold">
                      {typeof sprice === 'number' ? `${sprice} CFA` : (sprice || '-')}{sunit ? ` / ${sunit}` : ''}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ✅ Footer global */}
      <Footer />
    </div>
  );
};

export default ProductDetail;