import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings } from '../types';

export type Language = 'en' | 'ar' | 'fr';
type Translations = { [key: string]: string };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  translations: { [key in Language]?: Translations };
}

interface SettingsContextType {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => string;
}

const initialSettings: Settings = {
    storeName: 'Nexus Digital Store',
    storeDescription: 'Your one-stop shop for the best digital products and subscriptions.',
    contactEmail: 'support@jarya.tn',
    supportWhatsappNumber: '+15551234567',
    supportTelegramUsername: 'nexus_support',
    currency: 'TND',
    logoUrl: '',
    themeColor: '#F85757',
    adminUsername: 'admin@nexus.store',
    categories: [
      { id: 'cat-1', name: 'ALL', icon: 'grid', displayName: { en: 'ALL', fr: 'TOUS', ar: 'الكل' } },
      { id: 'cat-2', name: 'SVOD', icon: 'video', displayName: { en: 'SVOD', fr: 'SVOD', ar: 'فيديو حسب الطلب' } },
      { id: 'cat-3', name: 'Music', icon: 'music', displayName: { en: 'Music', fr: 'Musique', ar: 'موسيقى' } },
      { id: 'cat-4', name: 'AI', icon: 'ai', displayName: { en: 'AI', fr: 'IA', ar: 'ذكاء اصطناعي' } },
      { id: 'cat-5', name: 'Software', icon: 'code', displayName: { en: 'Software', fr: 'Logiciel', ar: 'برامج' } },
      { id: 'cat-6', name: 'Discover AI', icon: 'search', displayName: { en: 'Discover AI', fr: 'Découvrir l\'IA', ar: 'اكتشف الذكاء الاصطناعي' } },
      { id: 'cat-7', name: 'Reading', icon: 'book', displayName: { en: 'Reading', fr: 'Lecture', ar: 'قراءة' } },
      { id: 'cat-8', name: 'Learning', icon: 'edit', displayName: { en: 'Learning', fr: 'Apprentissage', ar: 'تعلم' } },
      { id: 'cat-9', name: 'New', icon: 'sparkles', displayName: { en: 'New', fr: 'Nouveau', ar: 'جديد' } },
      { id: 'cat-10', name: 'Marketplace', icon: 'cart', displayName: { en: 'Marketplace', fr: 'Marché', ar: 'المتجر' } },
    ],
    homePage: {
      hero: {
        title: {
          en: 'Shared premium subscription with lower price on GamsGo',
          fr: 'Abonnement premium partagé à prix réduit sur GamsGo',
          ar: 'اشتراك بريميوم مشترك بسعر أقل على GamsGo'
        },
        subtitle: {
          en: 'Providing high-quality, affordable streaming for 6 years',
          fr: 'Fournir un streaming de haute qualité et abordable depuis 6 ans',
          ar: 'توفير بث عالي الجودة وبأسعار معقولة لمدة 6 سنوات'
        }
      },
      whyUs: {
        titlePart1: { en: 'Why', fr: 'Pourquoi', ar: 'لماذا يستخدم' },
        titleHighlight: { en: 'more and more', fr: 'de plus en plus', ar: 'المزيد والمزيد' },
        titlePart2: { en: 'people use GamsGo?', fr: 'de gens utilisent GamsGo ?', ar: 'من الناس GamsGo؟' },
        features: [
          { icon: 'check', title: { en: 'REAL-TIME DELIVERY', fr: 'LIVRAISON EN TEMPS RÉEL', ar: 'توصيل فوري' }, description: { en: 'Real-time delivery after payment without waiting, fast arrival to dispel your worries.', fr: 'Livraison en temps réel après paiement sans attente, arrivée rapide pour dissiper vos soucis.', ar: 'توصيل فوري بعد الدفع دون انتظار، وصول سريع لتبديد مخاوفك.' } },
          { icon: 'passkey', title: { en: 'QUICK RESET PASSKEY', fr: 'CLÉ D\'ACCÈS À RÉINITIALISATION RAPIDE', ar: 'إعادة تعيين مفتاح المرور بسرعة' }, description: { en: 'Click reset passkey on the subscription page without waiting and manual operation.', fr: 'Cliquez sur réinitialiser la clé d\'accès sur la page d\'abonnement sans attente ni opération manuelle.', ar: 'انقر على إعادة تعيين مفتاح المرور في صفحة الاشتراك دون انتظار وعملية يدوية.' } },
          { icon: 'shield', title: { en: 'SSL CERTIFICATE', fr: 'CERTIFICAT SSL', ar: 'شهادة SSL' }, description: { en: 'Payments take place in a secure environment with an SSL security certificate.', fr: 'Les paiements s\'effectuent dans un environnement sécurisé avec un certificat de sécurité SSL.', ar: 'تتم عمليات الدفع في بيئة آمنة مع شهادة أمان SSL.' } },
          { icon: 'headset', title: { en: '24/7 LIVE SUPPORT', fr: 'SUPPORT EN DIRECT 24/7', ar: 'دعم مباشر 24/7' }, description: { en: 'GamsGo provides 24/7 online private customer service, help you have a good experience.', fr: 'GamsGo fournit un service client privé en ligne 24/7, pour vous aider à avoir une bonne expérience.', ar: 'يوفر GamsGo خدمة عملاء خاصة عبر الإنترنت على مدار الساعة طوال أيام الأسبوع، لمساعدتك في الحصول على تجربة جيدة.' } },
          { icon: 'handshake', title: { en: 'AFFORDABLE PREMIUM', fr: 'PREMIUM ABORDABLE', ar: 'بريميوم بأسعار معقولة' }, description: { en: 'Get premium subscription at lower price.', fr: 'Obtenez un abonnement premium à un prix inférieur.', ar: 'احصل على اشتراك بريميوم بسعر أقل.' } },
          { icon: 'refund-heart', title: { en: 'REFUND GUARANTEE', fr: 'GARANTIE DE REMBOURSEMENT', ar: 'ضمان استرداد الأموال' }, description: { en: 'We offer buyer protection, with refunds available within 24 hours.', fr: 'Nous offrons une protection à l\'acheteur, avec des remboursements disponibles dans les 24 heures.', ar: 'نحن نقدم حماية للمشتري، مع توفر المبالغ المستردة في غضون 24 ساعة.' }, link: { en: 'Refund Policy >', fr: 'Politique de remboursement >', ar: 'سياسة الاسترداد >' } },
        ]
      },
      aliexpressPromo: {
        title: {
          en: 'Shop from AliExpress, Pay Locally!',
          fr: 'Achetez sur AliExpress, Payez Localement !',
          ar: 'تسوق من AliExpress، وادفع محلياً!'
        },
        subtitle: {
          en: 'We buy for you from any international site.',
          fr: 'Nous achetons pour vous sur n\'importe quel site international.',
          ar: 'نشتري لك من أي موقع عالمي.'
        },
        cta: {
          en: 'Learn More',
          fr: 'En savoir plus',
          ar: 'اعرف المزيد'
        }
      },
      internationalShopperPromo: {
        title: { en: 'Shop from Any Store Worldwide', fr: 'Achetez dans n\'importe quelle boutique du monde', ar: 'تسوق من أي متجر في جميع أنحاء العالم' },
        subtitle: { en: 'We buy and ship physical products from Amazon, eBay, and more directly to you.', fr: 'Nous achetons et expédions des produits physiques depuis Amazon, eBay, et plus directement à vous.', ar: 'نشتري ونشحن المنتجات المادية من أمازون وإيباي والمزيد مباشرة إليك.' },
        cta: { en: 'Get a Quote', fr: 'Obtenir un devis', ar: 'احصل على عرض سعر' }
      },
      requestProductPromo: {
        title: {
          en: "Can't find what you're looking for?",
          fr: 'Vous ne trouvez pas ce que vous cherchez ?',
          ar: 'لا تجد ما تبحث عنه؟'
        },
        subtitle: {
          en: 'Let us know which product you wish to see in our store.',
          fr: 'Faites-nous savoir quel produit vous souhaitez voir dans notre boutique.',
          ar: 'أخبرنا بالمنتج الذي تود رؤيته في متجرنا.'
        },
        cta: {
          en: 'Request a Product',
          fr: 'Demander un produit',
          ar: 'اطلب منتج'
        }
      },
      mobileDataPromo: {
        title: {
          en: 'Top-Up Your Mobile Data',
          fr: 'Rechargez vos données mobiles',
          ar: 'اشحن بيانات هاتفك المحمول'
        },
        subtitle: {
          en: 'Get fast and reliable internet packs from your favorite operators.',
          fr: 'Obtenez des forfaits Internet rapides et fiables de vos opérateurs préférés.',
          ar: 'احصل على باقات إنترنت سريعة وموثوقة من مشغليك المفضلين.'
        }
      },
      giftCardPromo: {
        title: {
          en: 'Explore Our Gift Cards',
          fr: 'Découvrez nos cartes-cadeaux',
          ar: 'اكتشف بطاقات الهدايا لدينا'
        },
        subtitle: {
          en: 'The perfect gift for any occasion, delivered instantly.',
          fr: 'Le cadeau parfait pour toute occasion, livré instantanément.',
          ar: 'الهدية المثالية لأي مناسبة، تسلم على الفور.'
        }
      },
      footerNewsletter: {
        title: {
          en: 'Join Our Digital Universe',
          fr: 'Rejoignez notre univers numérique',
          ar: 'انضم إلى عالمنا الرقمي'
        },
        subtitle: {
          en: 'Get the latest deals, new products, and promotions straight to your inbox.',
          fr: 'Recevez les dernières offres, les nouveaux produits et les promotions directement dans votre boîte de réception.',
          ar: 'احصل على أحدث العروض والمنتجات الجديدة والعروض الترويجية مباشرة في بريدك الوارد.'
        },
        placeholder: {
          en: 'Enter your email address',
          fr: 'Entrez votre adresse e-mail',
          ar: 'أدخل عنوان بريدك الإلكتروني'
        },
        buttonText: {
          en: 'Subscribe',
          fr: 'S\'abonner',
          ar: 'اشتراك'
        }
      },
      componentsOrder: [
        'mobileData',
        'giftCards',
        'requestProductPromo',
        'internationalShopperPromo',
        'aliexpressPromo',
        'whyUs'
      ]
    },
    maintenancePage: {
      title: {
        en: 'We’ll be back soon!',
        fr: 'Nous revenons bientôt !',
        ar: 'سنعود قريباً!'
      },
      subtitle: {
        en: 'Sorry for the inconvenience. We’re performing some maintenance at the moment. We’ll be back online shortly!',
        fr: 'Désolé pour le dérangement. Nous effectuons une maintenance en ce moment. Nous serons de retour en ligne sous peu !',
        ar: 'نأسف للإزعاج. نقوم حاليًا ببعض أعمال الصيانة. سنعود للاتصال بالإنترنت قريبًا!'
      }
    },
    contactPage: {
      title: {
        en: 'Get In Touch',
        fr: 'Prenez contact',
        ar: 'تواصل معنا',
      },
      subtitle: {
        en: "Have questions or feedback? We'd love to hear from you. Reach out to us through any of the channels below.",
        fr: 'Avez-vous des questions ou des commentaires ? Nous aimerions avoir de vos nouvelles. Contactez-nous via l\'un des canaux ci-dessous.',
        ar: 'هل لديك أسئلة أو ملاحظات؟ نود أن نسمع منك. تواصل معنا عبر أي من القنوات أدناه.',
      },
      formTitle: {
        en: 'Send Us a Message',
        fr: 'Envoyez-nous un message',
        ar: 'أرسل لنا رسالة',
      },
      whatsappTitle: {
        en: 'Chat on WhatsApp',
        fr: 'Discuter sur WhatsApp',
        ar: 'الدردشة على WhatsApp',
      },
      whatsappSubtitle: {
        en: 'Need a quick answer? Chat with us live on WhatsApp for immediate support.',
        fr: 'Besoin d\'une réponse rapide ? Discutez avec nous en direct sur WhatsApp pour une assistance immédiate.',
        ar: 'هل تحتاج إلى إجابة سريعة؟ تحدث معنا مباشرة على WhatsApp للحصول على دعم فوري.',
      },
      whatsappCta: {
        en: 'Start Chat',
        fr: 'Commencer la discussion',
        ar: 'ابدأ الدردشة',
      },
      telegramTitle: {
        en: 'Chat on Telegram',
        fr: 'Discuter sur Telegram',
        ar: 'الدردشة على Telegram',
      },
      telegramSubtitle: {
        en: 'Prefer Telegram? Message us for quick assistance and support.',
        fr: 'Vous préférez Telegram ? Envoyez-nous un message pour une assistance rapide.',
        ar: 'هل تفضل تيليجرام؟ راسلنا للحصول على مساعدة ودعم سريع.',
      },
      telegramCta: {
        en: 'Open Telegram',
        fr: 'Ouvrir Telegram',
        ar: 'افتح تيليجرام',
      },
      socialTitle: {
        en: 'Follow Us',
        fr: 'Suivez-nous',
        ar: 'تابعنا',
      },
      socialLinks: [
        { name: 'facebook', href: '#' },
        { name: 'telegram', href: '#' },
        { name: 'tiktok', href: '#' },
        { name: 'youtube', href: '#' },
        { name: 'twitter-x', href: '#' },
      ],
      formLabels: {
        name: {
          en: 'Full Name',
          fr: 'Nom complet',
          ar: 'الاسم الكامل',
        },
        email: {
          en: 'Email Address',
          fr: 'Adresse e-mail',
          ar: 'البريد الإلكتروني',
        },
        message: {
          en: 'Your Message',
          fr: 'Votre message',
          ar: 'رسالتك',
        },
        sendButtonText: {
          en: 'Send Message',
          fr: 'Envoyer le message',
          ar: 'إرسال الرسالة',
        },
      },
      formSuccessMessage: {
        en: "Your message has been sent successfully! We'll get back to you shortly.",
        fr: "Votre message a été envoyé avec succès ! Nous vous répondrons sous peu.",
        ar: "تم إرسال رسالتك بنجاح! سوف نرد عليك قريبا.",
      },
    },
    footer: {
      staticLinks: [
        { key: 'nav.home', slug: '#' },
        { key: 'nav.subscription', slug: '#' },
        { key: 'footer.blog', slug: '#' },
        { key: 'nav.support', slug: '#' },
        { key: 'footer.contact.us', slug: '#' },
      ],
      socialLinks: [
        { name: 'facebook', href: '#' },
        { name: 'telegram', href: '#' },
        { name: 'tiktok', href: '#' },
        { name: 'youtube', href: '#' },
        { name: 'twitter-x', href: '#' },
      ],
      copyrightText: {
        en: '© 2025 NEXUS. All Rights Reserved.',
        fr: '© 2025 NEXUS. Tous droits réservés.',
        ar: '© 2025 NEXUS. جميع الحقوق محفوظة.',
      },
      subfooterLinks: [
        { key: 'footer.terms_of_service', slug: '#' },
        { key: 'footer.privacy_policy', slug: '#' },
      ]
    },
    services: {
      aliexpress: {
        checkoutTitle: {
          en: 'Confirm Your AliExpress Request',
          fr: 'Confirmez Votre Demande AliExpress',
          ar: 'تأكيد طلب AliExpress الخاص بك'
        },
        checkoutSubtitle: {
          en: 'Please provide your details below. We will contact you to finalize the order.',
          fr: 'Veuillez fournir vos coordonnées ci-dessous. Nous vous contacterons pour finaliser la commande.',
          ar: 'يرجى تقديم التفاصيل الخاصة بك أدناه. سنتصل بك لإنهاء الطلب.'
        },
        checkoutNextSteps: {
          en: '<strong>Next Steps:</strong> After submitting, our team will review your request and contact you via WhatsApp or Email to confirm the final details and arrange for local payment.',
          fr: '<strong>Prochaines Étapes :</strong> Après soumission, notre équipe examinera votre demande et vous contactera par WhatsApp ou par e-mail pour confirmer les détails finaux et organiser le paiement local.',
          ar: '<strong>الخطوات التالية:</strong> بعد الإرسال، سيقوم فريقنا بمراجعة طلبك والاتصال بك عبر WhatsApp أو البريد الإلكتروني لتأكيد التفاصيل النهائية وترتيب الدفع المحلي.'
        },
        thankYouTitle: {
          en: 'Request Received!',
          fr: 'Demande Reçue !',
          ar: 'تم استلام الطلب!'
        },
        thankYouSubtitle: {
          en: "We've received your request for order {{orderId}}. Our team will contact you at {{contactInfo}} shortly to finalize the details.",
          fr: "Nous avons reçu votre demande pour la commande {{orderId}}. Notre équipe vous contactera à {{contactInfo}} sous peu pour finaliser les détails.",
          ar: "لقد تلقينا طلبك رقم {{orderId}}. سيتصل بك فريقنا على {{contactInfo}} قريبًا لوضع اللمسات الأخيرة على التفاصيل."
        }
      },
      internationalShopper: {
        checkoutTitle: { en: 'Confirm Your International Order', fr: 'Confirmez votre commande internationale', ar: 'تأكيد طلبك الدولي' },
        checkoutSubtitle: { en: 'Provide your shipping details. We will contact you to finalize the payment.', fr: 'Fournissez vos détails d\'expédition. Nous vous contacterons pour finaliser le paiement.', ar: 'قدم تفاصيل الشحن الخاصة بك. سوف نتصل بك لإنهاء الدفع.' },
        checkoutNextSteps: { en: '<strong>Next Steps:</strong> Our team will contact you to confirm the final cost, including shipping and customs, and arrange for local payment.', fr: '<strong>Prochaines Étapes :</strong> Notre équipe vous contactera pour confirmer le coût final, y compris l\'expédition et les douanes, et organiser le paiement local.', ar: '<strong>الخطوات التالية:</strong> سيتصل بك فريقنا لتأكيد التكلفة النهائية، بما في ذلك الشحن والجمارك، وترتيب الدفع المحلي.' },
        thankYouTitle: { en: 'Request Received!', fr: 'Demande Reçue !', ar: 'تم استلام الطلب!' },
        thankYouSubtitle: { en: 'We will review your request for order {{orderId}} and contact you at {{contactInfo}} with a final quote.', fr: 'Nous examinerons votre demande pour la commande {{orderId}} et vous contacteros à {{contactInfo}} avec un devis final.', ar: 'سنراجع طلبك رقم {{orderId}} ونتصل بك على {{contactInfo}} مع عرض أسعار نهائي.' },
        noteTitle: { en: 'Please Note', fr: 'Veuillez noter', ar: 'يرجى ملاحظة' },
        noteBody: { en: 'This service is for physical products only. After you submit, we will provide a final quote including product cost, international shipping, customs, and our service fee. We\'ll contact you to confirm before any payment is required.', fr: 'Ce service est uniquement pour les produits physiques. Après votre soumission, nous vous fournirons un devis final incluant le coût du produit, la livraison internationale, les douanes et nos frais de service. Nous vous contacterons pour confirmer avant tout paiement.', ar: 'هذه الخدمة مخصصة للمنتجات المادية فقط. بعد تقديم طلبك، سنوفر لك عرض سعر نهائي يشمل تكلفة المنتج، الشحن الدولي، الجمارك، ورسوم خدمتنا. سنتواصل معك للتأكيد قبل طلب أي دفعة.' }
      },
      requestProduct: {
        fields: [
          { id: 'productName', type: 'text', label: { en: 'Product Name', fr: 'Nom du produit', ar: 'اسم المنتج' }, placeholder: { en: 'e.g., Adobe Photoshop', fr: 'ex: Adobe Photoshop', ar: 'مثال: Adobe Photoshop' }, enabled: true, required: true, isDefault: true },
          { id: 'category', type: 'text', label: { en: 'Product Category/Type', fr: 'Catégorie/Type de produit', ar: 'فئة/نوع المنتج' }, placeholder: { en: 'e.g., Software, Subscription', fr: 'ex: Logiciel, Abonnement', ar: 'مثال: برامج, اشتراك' }, enabled: true, required: true, isDefault: true },
          { id: 'link', type: 'url', label: { en: 'Product Link (Optional)', fr: 'Lien vers le produit (Optionnel)', ar: 'رابط المنتج (اختياري)' }, placeholder: { en: 'https://example.com/product', fr: 'https://example.com/product', ar: 'https://example.com/product' }, enabled: true, required: false, isDefault: true },
          { id: 'description', type: 'textarea', label: { en: 'Why do you want this product?', fr: 'Pourquoi voulez-vous ce produit ?', ar: 'لماذا تريد هذا المنتج؟' }, placeholder: { en: 'I need this for my design work...', fr: 'J\'ai besoin de ceci pour mon travail de conception...', ar: 'أحتاج هذا لعملي في التصميم...' }, enabled: true, required: true, isDefault: true },
          { id: 'userName', type: 'text', label: { en: 'Your Name', fr: 'Votre nom', ar: 'اسمك' }, placeholder: { en: 'John Doe', fr: 'John Doe', ar: 'جون دو' }, enabled: true, required: true, isDefault: true },
          { id: 'userEmail', type: 'email', label: { en: 'Your Email', fr: 'Votre e-mail', ar: 'بريدك الإلكتروني' }, placeholder: { en: 'you@example.com', fr: 'vous@example.com', ar: 'you@example.com' }, enabled: true, required: true, isDefault: true },
        ]
      },
    },
    payments: {
      stripe: { enabled: true, apiKey: '' },
      paypal: { enabled: false, clientId: '' },
      binance: { enabled: true, apiKey: '', secretKey: '' },
      bankTransfer: { 
          enabled: true,
          name: { value: 'Bank Transfer', enabled: true },
          accountName: { value: 'NEXUS DIGITAL SARL', enabled: true },
          accountNumber: { value: 'TN59 0100 5031 0012 3456 789', enabled: true },
          bankName: { value: 'International Bank of Tunis', enabled: true },
          whatsappNumber: { value: '+216 22 123 456', enabled: true }
      },
      click2pay: { enabled: false, apiKey: '' },
    },
    accessControl: {
        requireLoginToCheckout: false,
        googleLogin: { enabled: true, clientId: '' },
        facebookLogin: { enabled: true, appId: '' },
    },
    marketing: {
      facebookPixelId: '',
      googleAnalyticsId: '',
      mailchimp: { enabled: false, apiKey: '', listId: '' },
      sendgrid: { enabled: false, apiKey: '' },
    },
    advanced: {
      developerMode: false,
      maintenanceMode: false,
      customCss: '',
      customJs: '',
    }
};

export const I18nContext = createContext<I18nContextType | undefined>(undefined);
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'nexus-digital-store-settings';

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar'); // Default to Arabic
  const [translations, setTranslations] = useState<{ [key in Language]?: Translations }>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      // If settings are stored, parse them. Otherwise, use initial settings.
      return storedSettings ? JSON.parse(storedSettings) : initialSettings;
    } catch (error) {
      console.error("Error reading settings from localStorage", error);
      // Fallback to initial settings if parsing fails
      return initialSettings;
    }
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings to localStorage", error);
    }
  }, [settings]);


  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Use absolute paths for robust routing, assuming files are in the public folder.
        const [en, ar, fr] = await Promise.all([
          fetch('/i18n/locales/en.json').then(res => res.json()),
          fetch('/i18n/locales/ar.json').then(res => res.json()),
          fetch('/i18n/locales/fr.json').then(res => res.json())
        ]);
        setTranslations({ en, ar, fr });
      } catch (error) {
        console.error("Failed to load translation files", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    if (isLoading || !translations[language]) {
      return key;
    }
    let translation = translations[language]?.[key] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([replacementKey, value]) => {
        const regex = new RegExp(`{${replacementKey}}`, 'g');
        translation = translation.replace(regex, String(value));
      });
    }

    return translation;
  }, [language, translations, isLoading]);

  const formatCurrency = useCallback((amount: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: settings.currency,
        ...options,
    }).format(amount);
  }, [language, settings.currency]);


  if (isLoading) {
    // Display a loading spinner instead of a blank screen. This helps with perceived performance and debugging.
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', gap: '1rem' }}>
        <div style={{
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #F85757',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontFamily: 'sans-serif', color: '#475569' }}>Loading Store...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings, formatCurrency }}>
        <I18nContext.Provider value={{ language, setLanguage, t, translations }}>
            {children}
        </I18nContext.Provider>
    </SettingsContext.Provider>
  );
};