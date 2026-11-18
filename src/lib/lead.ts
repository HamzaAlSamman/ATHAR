// شكل طلب التواصل: مشترك بين الخادم ولوحة التحكم.
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  details: string;
  source: string;
  lang: string;
  createdAt: string;
}
