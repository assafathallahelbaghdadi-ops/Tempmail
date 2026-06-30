"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type Lang = "en" | "fr" | "ar"

export const LANGS: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "EN" },
  { code: "fr", label: "French", native: "Français", flag: "FR" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "ع" },
]

type Dict = Record<string, string>

const en: Dict = {
  "brand.tagline": "Free Temporary Email",
  "nav.howItWorks": "How it works",
  "nav.faq": "FAQ",
  "nav.language": "Language",

  "hero.title": "Your Temporary Email Address",
  "hero.subtitle":
    "Protect your real inbox from spam, ads and phishing. Get a free disposable email that works instantly — no registration required.",

  "address.label": "Your temporary email address",
  "address.loading": "Generating your address...",
  "action.copy": "Copy",
  "action.copied": "Copied!",
  "action.refresh": "Refresh",
  "action.change": "Change",
  "action.delete": "Delete",
  "action.qr": "QR",

  "inbox.title": "Inbox",
  "inbox.empty.title": "Your inbox is empty",
  "inbox.empty.subtitle":
    "Waiting for incoming emails. Messages sent to your address will appear here automatically.",
  "inbox.refreshing": "Checking for new messages...",
  "inbox.messages": "messages",
  "inbox.message": "message",
  "inbox.autoRefresh": "Auto-refreshing",
  "inbox.from": "From",
  "inbox.noSubject": "(No subject)",
  "inbox.justNow": "just now",
  "inbox.minutesAgo": "min ago",
  "inbox.hoursAgo": "h ago",
  "inbox.daysAgo": "d ago",

  "message.back": "Back to inbox",
  "message.delete": "Delete message",
  "message.from": "From",
  "message.to": "To",
  "message.date": "Date",
  "message.attachments": "Attachments",
  "message.loading": "Loading message...",

  "edit.title": "Change your email address",
  "edit.description":
    "Choose a custom username and a domain for your temporary address.",
  "edit.username": "Username",
  "edit.domain": "Domain",
  "edit.cancel": "Cancel",
  "edit.create": "Create address",
  "edit.creating": "Creating...",
  "edit.usernamePlaceholder": "yourname",

  "toast.copied": "Email address copied to clipboard",
  "toast.created": "New email address created",
  "toast.deleted": "Address deleted. A new one was generated.",
  "toast.messageDeleted": "Message deleted",
  "toast.error": "Something went wrong. Please try again.",
  "toast.newMessage": "You received a new email!",

  "how.title": "How does TempMail work?",
  "how.step1.title": "Get an address",
  "how.step1.text":
    "A unique temporary email address is created for you automatically when you open the page.",
  "how.step2.title": "Use it anywhere",
  "how.step2.text":
    "Copy the address and use it to sign up for sites, download files or receive activation emails.",
  "how.step3.title": "Receive emails",
  "how.step3.text":
    "Incoming messages appear in your inbox in real time. Read them, then let them disappear.",
  "how.step4.title": "Stay private",
  "how.step4.text":
    "When you are done, delete the address. Your real inbox stays clean and spam-free.",

  "faq.title": "Frequently asked questions",
  "faq.q1": "Is TempMail really free?",
  "faq.a1":
    "Yes. TempMail is completely free to use. Generate as many disposable addresses as you need.",
  "faq.q2": "How long does the address last?",
  "faq.a2":
    "The address stays active while you use it. You can refresh it or create a new one at any time.",
  "faq.q3": "Can I send emails?",
  "faq.a3":
    "TempMail is designed for receiving messages such as verification and activation emails, not for sending.",
  "faq.q4": "Is it safe to use?",
  "faq.a4":
    "Disposable email keeps your real address private and protects you from spam and tracking.",

  "footer.tagline": "Free, fast and anonymous disposable email.",
  "footer.rights": "All rights reserved.",
  "footer.disclaimer":
    "TempMail is a demo project for receiving temporary emails. Do not use it for sensitive or important communications.",

  "ad.label": "Advertisement",
}

const fr: Dict = {
  "brand.tagline": "E-mail Temporaire Gratuit",
  "nav.howItWorks": "Comment ça marche",
  "nav.faq": "FAQ",
  "nav.language": "Langue",

  "hero.title": "Votre Adresse E-mail Temporaire",
  "hero.subtitle":
    "Protégez votre vraie boîte de réception du spam, des publicités et du phishing. Obtenez un e-mail jetable gratuit qui fonctionne instantanément — sans inscription.",

  "address.label": "Votre adresse e-mail temporaire",
  "address.loading": "Génération de votre adresse...",
  "action.copy": "Copier",
  "action.copied": "Copié !",
  "action.refresh": "Actualiser",
  "action.change": "Modifier",
  "action.delete": "Supprimer",
  "action.qr": "QR",

  "inbox.title": "Boîte de réception",
  "inbox.empty.title": "Votre boîte est vide",
  "inbox.empty.subtitle":
    "En attente d'e-mails entrants. Les messages envoyés à votre adresse apparaîtront ici automatiquement.",
  "inbox.refreshing": "Recherche de nouveaux messages...",
  "inbox.messages": "messages",
  "inbox.message": "message",
  "inbox.autoRefresh": "Actualisation auto",
  "inbox.from": "De",
  "inbox.noSubject": "(Sans objet)",
  "inbox.justNow": "à l'instant",
  "inbox.minutesAgo": "min",
  "inbox.hoursAgo": "h",
  "inbox.daysAgo": "j",

  "message.back": "Retour à la boîte",
  "message.delete": "Supprimer le message",
  "message.from": "De",
  "message.to": "À",
  "message.date": "Date",
  "message.attachments": "Pièces jointes",
  "message.loading": "Chargement du message...",

  "edit.title": "Modifier votre adresse e-mail",
  "edit.description":
    "Choisissez un nom d'utilisateur personnalisé et un domaine pour votre adresse temporaire.",
  "edit.username": "Nom d'utilisateur",
  "edit.domain": "Domaine",
  "edit.cancel": "Annuler",
  "edit.create": "Créer l'adresse",
  "edit.creating": "Création...",
  "edit.usernamePlaceholder": "votrenom",

  "toast.copied": "Adresse e-mail copiée dans le presse-papiers",
  "toast.created": "Nouvelle adresse e-mail créée",
  "toast.deleted": "Adresse supprimée. Une nouvelle a été générée.",
  "toast.messageDeleted": "Message supprimé",
  "toast.error": "Une erreur s'est produite. Veuillez réessayer.",
  "toast.newMessage": "Vous avez reçu un nouvel e-mail !",

  "how.title": "Comment fonctionne TempMail ?",
  "how.step1.title": "Obtenez une adresse",
  "how.step1.text":
    "Une adresse e-mail temporaire unique est créée automatiquement à l'ouverture de la page.",
  "how.step2.title": "Utilisez-la partout",
  "how.step2.text":
    "Copiez l'adresse et utilisez-la pour vous inscrire, télécharger des fichiers ou recevoir des e-mails d'activation.",
  "how.step3.title": "Recevez des e-mails",
  "how.step3.text":
    "Les messages entrants apparaissent dans votre boîte en temps réel. Lisez-les, puis laissez-les disparaître.",
  "how.step4.title": "Restez privé",
  "how.step4.text":
    "Quand vous avez terminé, supprimez l'adresse. Votre vraie boîte reste propre et sans spam.",

  "faq.title": "Questions fréquentes",
  "faq.q1": "TempMail est-il vraiment gratuit ?",
  "faq.a1":
    "Oui. TempMail est entièrement gratuit. Générez autant d'adresses jetables que nécessaire.",
  "faq.q2": "Combien de temps l'adresse dure-t-elle ?",
  "faq.a2":
    "L'adresse reste active tant que vous l'utilisez. Vous pouvez l'actualiser ou en créer une nouvelle à tout moment.",
  "faq.q3": "Puis-je envoyer des e-mails ?",
  "faq.a3":
    "TempMail est conçu pour recevoir des messages comme les e-mails de vérification et d'activation, pas pour en envoyer.",
  "faq.q4": "Est-ce sûr à utiliser ?",
  "faq.a4":
    "L'e-mail jetable garde votre vraie adresse privée et vous protège du spam et du suivi.",

  "footer.tagline": "E-mail jetable gratuit, rapide et anonyme.",
  "footer.rights": "Tous droits réservés.",
  "footer.disclaimer":
    "TempMail est un projet de démonstration pour recevoir des e-mails temporaires. Ne l'utilisez pas pour des communications sensibles ou importantes.",

  "ad.label": "Publicité",
}

const ar: Dict = {
  "brand.tagline": "بريد إلكتروني مؤقت مجاني",
  "nav.howItWorks": "كيف يعمل",
  "nav.faq": "الأسئلة الشائعة",
  "nav.language": "اللغة",

  "hero.title": "عنوان بريدك الإلكتروني المؤقت",
  "hero.subtitle":
    "احمِ بريدك الحقيقي من الرسائل المزعجة والإعلانات والتصيّد. احصل على بريد إلكتروني مؤقت مجاني يعمل فورًا — دون أي تسجيل.",

  "address.label": "عنوان بريدك الإلكتروني المؤقت",
  "address.loading": "جارٍ إنشاء عنوانك...",
  "action.copy": "نسخ",
  "action.copied": "تم النسخ!",
  "action.refresh": "تحديث",
  "action.change": "تغيير",
  "action.delete": "حذف",
  "action.qr": "رمز QR",

  "inbox.title": "صندوق الوارد",
  "inbox.empty.title": "صندوق الوارد فارغ",
  "inbox.empty.subtitle":
    "في انتظار الرسائل الواردة. ستظهر الرسائل المرسلة إلى عنوانك هنا تلقائيًا.",
  "inbox.refreshing": "جارٍ البحث عن رسائل جديدة...",
  "inbox.messages": "رسائل",
  "inbox.message": "رسالة",
  "inbox.autoRefresh": "تحديث تلقائي",
  "inbox.from": "من",
  "inbox.noSubject": "(بدون موضوع)",
  "inbox.justNow": "الآن",
  "inbox.minutesAgo": "دقيقة",
  "inbox.hoursAgo": "ساعة",
  "inbox.daysAgo": "يوم",

  "message.back": "العودة إلى صندوق الوارد",
  "message.delete": "حذف الرسالة",
  "message.from": "من",
  "message.to": "إلى",
  "message.date": "التاريخ",
  "message.attachments": "المرفقات",
  "message.loading": "جارٍ تحميل الرسالة...",

  "edit.title": "تغيير عنوان بريدك الإلكتروني",
  "edit.description":
    "اختر اسم مستخدم مخصصًا ونطاقًا لعنوانك المؤقت.",
  "edit.username": "اسم المستخدم",
  "edit.domain": "النطاق",
  "edit.cancel": "إلغاء",
  "edit.create": "إنشاء العنوان",
  "edit.creating": "جارٍ الإنشاء...",
  "edit.usernamePlaceholder": "اسمك",

  "toast.copied": "تم نسخ عنوان البريد إلى الحافظة",
  "toast.created": "تم إنشاء عنوان بريد جديد",
  "toast.deleted": "تم حذف العنوان. تم إنشاء عنوان جديد.",
  "toast.messageDeleted": "تم حذف الرسالة",
  "toast.error": "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  "toast.newMessage": "لقد استلمت رسالة جديدة!",

  "how.title": "كيف يعمل TempMail؟",
  "how.step1.title": "احصل على عنوان",
  "how.step1.text":
    "يتم إنشاء عنوان بريد إلكتروني مؤقت فريد لك تلقائيًا عند فتح الصفحة.",
  "how.step2.title": "استخدمه في أي مكان",
  "how.step2.text":
    "انسخ العنوان واستخدمه للتسجيل في المواقع أو تنزيل الملفات أو استقبال رسائل التفعيل.",
  "how.step3.title": "استقبل الرسائل",
  "how.step3.text":
    "تظهر الرسائل الواردة في صندوقك في الوقت الفعلي. اقرأها ثم دعها تختفي.",
  "how.step4.title": "حافظ على خصوصيتك",
  "how.step4.text":
    "عند الانتهاء، احذف العنوان. يبقى بريدك الحقيقي نظيفًا وخاليًا من الرسائل المزعجة.",

  "faq.title": "الأسئلة الشائعة",
  "faq.q1": "هل TempMail مجاني حقًا؟",
  "faq.a1":
    "نعم. TempMail مجاني تمامًا للاستخدام. أنشئ أي عدد تريده من العناوين المؤقتة.",
  "faq.q2": "كم تدوم صلاحية العنوان؟",
  "faq.a2":
    "يبقى العنوان نشطًا طالما أنك تستخدمه. يمكنك تحديثه أو إنشاء عنوان جديد في أي وقت.",
  "faq.q3": "هل يمكنني إرسال رسائل؟",
  "faq.a3":
    "تم تصميم TempMail لاستقبال الرسائل مثل رسائل التحقق والتفعيل، وليس للإرسال.",
  "faq.q4": "هل استخدامه آمن؟",
  "faq.a4":
    "يحافظ البريد المؤقت على خصوصية عنوانك الحقيقي ويحميك من الرسائل المزعجة والتتبّع.",

  "footer.tagline": "بريد مؤقت مجاني وسريع ومجهول.",
  "footer.rights": "جميع الحقوق محفوظة.",
  "footer.disclaimer":
    "TempMail هو مشروع تجريبي لاستقبال الرسائل المؤقتة. لا تستخدمه للاتصالات الحساسة أو المهمة.",

  "ad.label": "إعلان",
}

const dictionaries: Record<Lang, Dict> = { en, fr, ar }

type I18nContextValue = {
  lang: Lang
  dir: "ltr" | "rtl"
  setLang: (lang: Lang) => void
  t: (key: keyof typeof en) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = "tempmail-lang"

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY)) as Lang | null
    if (stored && dictionaries[stored]) {
      setLangState(stored)
    } else if (typeof navigator !== "undefined") {
      const nav = navigator.language.slice(0, 2)
      if (nav === "fr" || nav === "ar") setLangState(nav)
    }
  }, [])

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.documentElement.classList.toggle("font-arabic", lang === "ar")
  }, [lang, dir])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }, [])

  const t = useCallback(
    (key: keyof typeof en) => dictionaries[lang][key] ?? en[key] ?? String(key),
    [lang],
  )

  return (
    <I18nContext.Provider value={{ lang, dir, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
