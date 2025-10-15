import express from 'express';
import cors from 'cors';
import { getPool } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// --- INITIAL DATA (Used for seeding) ---

const initialSettings = {
    storeName: 'Nexus Digital Store',
    storeDescription: 'Your one-stop shop for the best digital products and subscriptions.',
    contactEmail: 'support@jarya.tn',
    supportWhatsappNumber: '+15551234567',
    supportTelegramUsername: 'nexus_support',
    currency: 'TND',
    logoUrl: '',
    themeColor: '#F85757',
    adminUsername: 'admin',
    adminPassword: 'password123',
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
        title: { en: 'Shared premium subscription with lower price on GamsGo', fr: 'Abonnement premium partagé à prix réduit sur GamsGo', ar: 'اشتراك بريميوم مشترك بسعر أقل على GamsGo' },
        subtitle: { en: 'Providing high-quality, affordable streaming for 6 years', fr: 'Fournir un streaming de haute qualité et abordable depuis 6 ans', ar: 'توفير بث عالي الجودة وبأسعار معقولة لمدة 6 سنوات' }
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
        title: { en: 'Shop from AliExpress, Pay Locally!', fr: 'Achetez sur AliExpress, Payez Localement !', ar: 'تسوق من AliExpress، وادفع محلياً!' },
        subtitle: { en: 'We buy for you from any international site.', fr: 'Nous achetons pour vous sur n\'importe quel site international.', ar: 'نشتري لك من أي موقع عالمي.' },
        cta: { en: 'Learn More', fr: 'En savoir plus', ar: 'اعرف المزيد' }
      },
      internationalShopperPromo: {
        title: { en: 'Shop from Any Store Worldwide', fr: 'Achetez dans n\'importe quelle boutique du monde', ar: 'تسوق من أي متجر في جميع أنحاء العالم' },
        subtitle: { en: 'We buy and ship physical products from Amazon, eBay, and more directly to you.', fr: 'Nous achetons et expédions des produits physiques depuis Amazon, eBay, et plus directement à vous.', ar: 'نشتري ونشحن المنتجات المادية من أمازون وإيباي والمزيد مباشرة إليك.' },
        cta: { en: 'Get a Quote', fr: 'Obtenir un devis', ar: 'احصل على عرض سعر' }
      },
      requestProductPromo: {
        title: { en: "Can't find what you're looking for?", fr: 'Vous ne trouvez pas ce que vous cherchez ?', ar: 'لا تجد ما تبحث عنه؟' },
        subtitle: { en: 'Let us know which product you wish to see in our store.', fr: 'Faites-nous savoir quel produit vous souhaitez voir dans notre boutique.', ar: 'أخبرنا بالمنتج الذي تود رؤيته في متجرنا.' },
        cta: { en: 'Request a Product', fr: 'Demander un produit', ar: 'اطلب منتج' }
      },
      mobileDataPromo: {
        title: { en: 'Top-Up Your Mobile Data', fr: 'Rechargez vos données mobiles', ar: 'اشحن بيانات هاتفك المحمول' },
        subtitle: { en: 'Get fast and reliable internet packs from your favorite operators.', fr: 'Obtenez des forfaits Internet rapides et fiables de vos opérateurs préférés.', ar: 'احصل على باقات إنترنت سريعة وموثوقة من مشغليك المفضلين.' }
      },
      giftCardPromo: {
        title: { en: 'Explore Our Gift Cards', fr: 'Découvrez nos cartes-cadeaux', ar: 'اكتشف بطاقات الهدايا لدينا' },
        subtitle: { en: 'The perfect gift for any occasion, delivered instantly.', fr: 'Le cadeau parfait pour toute occasion, livré instantanément.', ar: 'الهدية المثالية لأي مناسبة، تسلم على الفور.' }
      },
      footerNewsletter: {
        title: { en: 'Join Our Digital Universe', fr: 'Rejoignez notre univers numérique', ar: 'انضم إلى عالمنا الرقمي' },
        subtitle: { en: 'Get the latest deals, new products, and promotions straight to your inbox.', fr: 'Recevez les dernières offres, les nouveaux produits et les promotions directement dans votre boîte de réception.', ar: 'احصل على أحدث العروض والمنتجات الجديدة والعروض الترويجية مباشرة في بريدك الوارد.' },
        placeholder: { en: 'Enter your email address', fr: 'Entrez votre adresse e-mail', ar: 'أدخل عنوان بريدك الإلكتروني' },
        buttonText: { en: 'Subscribe', fr: 'S\'abonner', ar: 'اشتراك' }
      },
      componentsOrder: [ 'mobileData', 'giftCards', 'requestProductPromo', 'internationalShopperPromo', 'aliexpressPromo', 'whyUs' ]
    },
    explorePage: {
      title: { en: 'Explore Our Catalog', fr: 'Découvrez Notre Catalogue', ar: 'استكشف كتالوجنا' },
      subtitle: { en: 'Everything we offer, all in one place.', fr: 'Tout ce que nous proposons, en un seul endroit.', ar: 'كل ما نقدمه، في مكان واحد.' },
      sections: {
        products: { title: { en: 'All Products', fr: 'Tous les Produits', ar: 'جميع المنتجات' }, enabled: true },
        services: { title: { en: 'Special Services', fr: 'Services Spéciaux', ar: 'خدمات خاصة' }, enabled: true },
        giftCards: { title: { en: 'Gift Cards', fr: 'Cartes Cadeaux', ar: 'بطاقات الهدايا' }, enabled: true },
        mobileData: { title: { en: 'Mobile Data Providers', fr: 'Fournisseurs de Données Mobiles', ar: 'مزودي بيانات الجوال' }, enabled: true },
        pages: { title: { en: 'Information Pages', fr: 'Pages d\'Information', ar: 'صفحات المعلومات' }, enabled: true },
        categories: { title: { en: 'Product Categories', fr: 'Catégories de Produits', ar: 'فئات المنتجات' }, enabled: true }
      }
    },
    maintenancePage: {
      title: { en: 'We’ll be back soon!', fr: 'Nous revenons bientôt !', ar: 'سنعود قريباً!' },
      subtitle: { en: 'Sorry for the inconvenience. We’re performing some maintenance at the moment. We’ll be back online shortly!', fr: 'Désolé pour le dérangement. Nous effectuons une maintenance en ce moment. Nous serons de retour en ligne sous peu !', ar: 'نأسف للإزعاج. نقوم حاليًا ببعض أعمال الصيانة. سنعود للاتصال بالإنترنت قريبًا!' }
    },
    contactPage: {
      title: { en: 'Get In Touch', fr: 'Prenez contact', ar: 'تواصل معنا', },
      subtitle: { en: "Have questions or feedback? We'd love to hear from you. Reach out to us through any of the channels below.", fr: 'Avez-vous des questions ou des commentaires ? Nous aimerions avoir de vos nouvelles. Contactez-nous via l\'un des canaux ci-dessous.', ar: 'هل لديك أسئلة أو ملاحظات؟ نود أن نسمع منك. تواصل معنا عبر أي من القنوات أدناه.', },
      formTitle: { en: 'Send Us a Message', fr: 'Envoyez-nous un message', ar: 'أرسل لنا رسالة', },
      whatsappTitle: { en: 'Chat on WhatsApp', fr: 'Discuter sur WhatsApp', ar: 'الدردشة على WhatsApp', },
      whatsappSubtitle: { en: 'Need a quick answer? Chat with us live on WhatsApp for immediate support.', fr: 'Besoin d\'une réponse rapide ? Discutez avec nous en direct sur WhatsApp pour une assistance immédiate.', ar: 'هل تحتاج إلى إجابة سريعة؟ تحدث معنا مباشرة على WhatsApp للحصول على دعم فوري.', },
      whatsappCta: { en: 'Start Chat', fr: 'Commencer la discussion', ar: 'ابدأ الدردشة', },
      telegramTitle: { en: 'Chat on Telegram', fr: 'Discuter sur Telegram', ar: 'الدردشة على Telegram', },
      telegramSubtitle: { en: 'Prefer Telegram? Message us for quick assistance and support.', fr: 'Vous préférez Telegram ? Envoyez-nous un message pour une assistance rapide.', ar: 'هل تفضل تيليجرام؟ راسلنا للحصول على مساعدة ودعم سريع.', },
      telegramCta: { en: 'Open Telegram', fr: 'Ouvrir Telegram', ar: 'افتح تيليجرام', },
      socialTitle: { en: 'Follow Us', fr: 'Suivez-nous', ar: 'تابعنا', },
      socialLinks: [ { name: 'facebook', href: '#' }, { name: 'telegram', href: '#' }, { name: 'tiktok', href: '#' }, { name: 'youtube', href: '#' }, { name: 'twitter-x', href: '#' }, ],
      formLabels: {
        name: { en: 'Full Name', fr: 'Nom complet', ar: 'الاسم الكامل', },
        email: { en: 'Email Address', fr: 'Adresse e-mail', ar: 'البريد الإلكتروني', },
        message: { en: 'Your Message', fr: 'Votre message', ar: 'رسالتك', },
        sendButtonText: { en: 'Send Message', fr: 'Envoyer le message', ar: 'إرسال الرسالة', },
      },
      formSuccessMessage: { en: "Your message has been sent successfully! We'll get back to you shortly.", fr: "Votre message a été envoyé avec succès ! Nous vous répondrons sous peu.", ar: "تم إرسال رسالتك بنجاح! سوف نرد عليك قريبا.", },
    },
    footer: {
      staticLinks: [ { key: 'nav.home', slug: '/' }, { key: 'nav.subscription', slug: '#' }, { key: 'footer.blog', slug: '#' }, { key: 'nav.support', slug: '#' }, { key: 'footer.contact.us', slug: '#' }, ],
      socialLinks: [ { name: 'facebook', href: '#' }, { name: 'telegram', href: '#' }, { name: 'tiktok', href: '#' }, { name: 'youtube', href: '#' }, { name: 'twitter-x', href: '#' }, ],
      copyrightText: { en: '© 2025 NEXUS. All Rights Reserved.', fr: '© 2025 NEXUS. Tous droits réservés.', ar: '© 2025 NEXUS. جميع الحقوق محفوظة.', },
      subfooterLinks: [ { key: 'footer.terms_of_service', slug: '#' }, { key: 'footer.privacy_policy', slug: '#' }, ]
    },
    services: {
      aliexpress: {
        checkoutTitle: { en: 'Confirm Your AliExpress Request', fr: 'Confirmez Votre Demande AliExpress', ar: 'تأكيد طلب AliExpress الخاص بك' },
        checkoutSubtitle: { en: 'Please provide your details below. We will contact you to finalize the order.', fr: 'Veuillez fournir vos coordonnées ci-dessous. Nous vous contacterons pour finaliser la commande.', ar: 'يرجى تقديم التفاصيل الخاصة بك أدناه. سنتصل بك لإنهاء الطلب.' },
        checkoutNextSteps: { en: '<strong>Next Steps:</strong> After submitting, our team will review your request and contact you via WhatsApp or Email to confirm the final details and arrange for local payment.', fr: '<strong>Prochaines Étapes :</strong> Après soumission, notre équipe examinera votre demande et vous contactera par WhatsApp ou par e-mail pour confirmer les détails finaux et organiser le paiement local.', ar: '<strong>الخطوات التالية:</strong> بعد الإرسال، سيقوم فريقنا بمراجعة طلبك والاتصال بك عبر WhatsApp أو البريد الإلكتروني لتأكيد التفاصيل النهائية وترتيب الدفع المحلي.' },
        thankYouTitle: { en: 'Request Received!', fr: 'Demande Reçue !', ar: 'تم استلام الطلب!' },
        thankYouSubtitle: { en: "We've received your request for order {{orderId}}. Our team will contact you at {{contactInfo}} shortly to finalize the details.", fr: "Nous avons reçu votre demande pour la commande {{orderId}}. Notre équipe vous contactera à {{contactInfo}} sous peu pour finaliser les détails.", ar: "لقد تلقينا طلبك رقم {{orderId}}. سيتصل بك فريقنا على {{contactInfo}} قريبًا لوضع اللمسات الأخيرة على التفاصيل." }
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

const initialData = {
  products: [],
  giftCards: [],
  mobileDataProviders: [],
  orders: [],
  subscriptions: [],
  pages: [],
  subscribers: [],
  campaigns: [],
  productRequests: [],
  users: [],
  settings: initialSettings,
};


// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- SETUP & STATUS API ENDPOINTS ---

app.get('/api/status', async (req, res) => {
    try {
        await getPool(); // This will throw if connection fails
        const pool = await getPool(); // Get the instance
        
        // Check if table exists
        await pool.query(`SELECT 1 FROM store_data LIMIT 1`);

        // Check if data is seeded
        const [rows] = await pool.query("SELECT id FROM store_data WHERE id = 'main'");
        
        res.json({
            server: "ok",
            dbConnection: "connected",
            dbInitialized: rows.length > 0,
        });

    } catch (error) {
        // Provide detailed error messages for the setup UI
        if (error.code === 'ER_BAD_DB_ERROR') {
             res.json({ server: "ok", dbConnection: "disconnected", dbInitialized: false, error: `Database '${process.env.DB_NAME}' does not exist. Please create it or check the name in your .env file.` });
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
             res.json({ server: "ok", dbConnection: "disconnected", dbInitialized: false, error: `Access denied for user '${process.env.DB_USER}'. Check username/password in .env.` });
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
             res.json({ server: "ok", dbConnection: "disconnected", dbInitialized: false, error: `Could not connect to host '${process.env.DB_HOST}'. Is the database server running and accessible?` });
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
             res.json({ server: "ok", dbConnection: "connected", dbInitialized: false, error: "Database is connected, but not initialized." });
        } else {
            res.json({ server: "ok", dbConnection: "disconnected", dbInitialized: false, error: error.message });
        }
    }
});

app.post('/api/initialize-database', async (req, res) => {
    try {
        const pool = await getPool();
        
        await pool.query(`
          CREATE TABLE IF NOT EXISTS store_data (
            id VARCHAR(10) PRIMARY KEY,
            data JSON
          )
        `);
        
        // Using INSERT IGNORE to be safe if called multiple times
        await pool.query("INSERT IGNORE INTO store_data (id, data) VALUES ('main', ?)", [JSON.stringify(initialData)]);

        res.json({ success: true, message: "Database initialized successfully!" });

    } catch (error) {
        console.error('Error during database initialization:', error);
        res.status(500).json({ success: false, message: `Initialization failed: ${error.message}` });
    }
});

// --- MAIN API ENDPOINTS ---

// Wrapper to handle DB connection for main API routes
const withDb = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'A database error occurred. The database may not be connected or configured properly.' });
    }
};

app.get('/api/data', withDb(async (req, res) => {
    const pool = await getPool();
    const [rows] = await pool.query("SELECT data FROM store_data WHERE id = 'main'");
    if (rows.length === 0) {
        return res.status(404).json({ message: 'No store data found. The database might be empty.' });
    }
    const storeData = JSON.parse(rows[0].data);
    res.json(storeData);
}));

app.post('/api/orders', withDb(async (req, res) => {
    const pool = await getPool();
    const newOrder = req.body;
    const [rows] = await pool.query("SELECT data FROM store_data WHERE id = 'main'");
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Store data not found.' });
    }
    const storeData = JSON.parse(rows[0].data);
    if (!storeData.orders) storeData.orders = [];
    storeData.orders.unshift(newOrder);
    await pool.query("UPDATE store_data SET data = ? WHERE id = 'main'", [JSON.stringify(storeData)]);
    res.status(201).json(newOrder);
}));

app.post('/api/settings', withDb(async (req, res) => {
    const pool = await getPool();
    const newSettings = req.body;
    const [rows] = await pool.query("SELECT data FROM store_data WHERE id = 'main'");
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Store data not found.' });
    }
    const storeData = JSON.parse(rows[0].data);
    storeData.settings = newSettings;
    await pool.query("UPDATE store_data SET data = ? WHERE id = 'main'", [JSON.stringify(storeData)]);
    res.status(200).json(newSettings);
}));

// --- SERVER STARTUP ---

app.listen(port, () => {
  console.log(`Backend server started on http://127.0.0.1:${port}`);
  console.log("API endpoints are ready. Database connection will be established on first API request.");
});
