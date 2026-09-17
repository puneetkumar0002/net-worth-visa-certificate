import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, getDocs, limit } from 'firebase/firestore';

const initialCities = [
  {
    city: "Chandigarh",
    state: "Punjab/Haryana",
    slug: "chandigarh",
    h1: "Net Worth Certificate for Your Visa Application in Chandigarh",
    intro: "Get a professionally prepared Net Worth Certificate for visa applications in Chandigarh with CA review, asset-liability summary, document guidance and online support.",
    localContent: `Networth Certificate Visa provides specialized financial documentation services for residents of Chandigarh. Whether you are living in Sector 17, Sector 35, or any other part of the City Beautiful, our team helps you consolidate your assets for various visa types.

For students planning to study in Canada, UK, or Australia, we provide CA-certified reports that meet the stringent requirements of high commissions. Our reports include property valuation summaries, bank balance certifications, and investment proofs.

Chandigarh being a hub for international education, we understand the specific needs of local applicants. Our process is entirely online, allowing you to submit documents from the comfort of your home.`,
    faqs: [
      { question: "Can I get a Net Worth Certificate online in Chandigarh?", answer: "Yes, our process is 100% online. You can submit your documents via WhatsApp or email, and we will send the digital CA-signed certificate with UDIN." },
      { question: "Is property in nearby areas like Zirakpur included?", answer: "Yes, we can include property located in Zirakpur, Mohali, Panchkula, or any part of the Tricity area in your Net Worth Certificate." },
      { question: "Do I need to visit a physical CA office in Chandigarh?", answer: "No, physical visits are not required. We handle everything remotely through our digital processing system." },
      { question: "What is the turnaround time for applicants in Chandigarh?", answer: "Typically, we deliver the final certificate within 24 to 48 hours of receiving all necessary supporting documents." }
    ],
    metaTitle: "Net Worth Certificate for Visa in Chandigarh | CA-Certified",
    metaDescription: "Professional CA-certified Net Worth Certificate for visa applications in Chandigarh. Fast processing, UDIN verified, 100% online support for students & visitors."
  },
  {
    city: "Mohali",
    state: "Punjab",
    slug: "mohali",
    h1: "Net Worth Certificate for Your Visa Application in Mohali",
    intro: "Professionally prepared financial documentation for visa applicants in Mohali, including property, bank balances, fixed deposits, and investments.",
    localContent: `In the growing city of Mohali (SAS Nagar), many residents are looking for reliable visa documentation services. Our firm provides comprehensive Net Worth Certificates that help demonstrate your financial strength to visa officers.

We cater to IT professionals working in Quark City and Phase 8, as well as students from the many educational institutions in the area. Our certificates are prepared by experienced Chartered Accountants and include a unique UDIN for global verification.

Our services are designed to be fast and efficient, matching the pace of life in Mohali. We accept digital copies of all financial documents.`,
    faqs: [
      { question: "Can property in Mohali be included in the certificate?", answer: "Absolutely. We include residential, commercial, and agricultural property located in Mohali in our comprehensive net worth assessments." },
      { question: "How can I submit my bank statements in Mohali?", answer: "You can simply download your bank statements as PDFs and share them with us via our secure WhatsApp or email." },
      { question: "Are parents' assets valid for a student visa in Mohali?", answer: "Yes, if your parents are sponsoring your education, their assets can be consolidated into a family net worth certificate." },
      { question: "How long does document review take for Mohali residents?", answer: "Our preliminary review is usually completed within 4-6 hours of submission." }
    ],
    metaTitle: "Net Worth Certificate for Visa in Mohali | CA-Certified",
    metaDescription: "Get your Net Worth Certificate for visa in Mohali. CA-verified financial proof for Canada, UK, USA & Australia. Fast online processing for local applicants."
  },
  {
    city: "Delhi",
    state: "Delhi NCR",
    slug: "delhi",
    h1: "Net Worth Certificate for Your Visa Application in Delhi",
    intro: "Expert CA-certified Net Worth Certificates for visa applicants in Delhi. Comprehensive financial proof with UDIN for all global visa categories.",
    localContent: `As the national capital, Delhi sees a massive volume of visa applications every day. We provide premium Net Worth Certificate services to applicants across New Delhi, South Delhi, West Delhi, and all other zones.

Our CA-certified reports are designed to stand out in the eyes of visa officers at embassies and high commissions in Delhi. We ensure every asset—from Lajpat Nagar properties to investments in Connaught Place businesses—is correctly valued and presented.

We offer remote processing to help you avoid the heavy Delhi traffic. Everything is handled digitally through our secure platform.`,
    faqs: [
      { question: "Can I get a Net Worth Certificate same-day in Delhi?", answer: "While our standard time is 24-48 hours, we do offer express processing for urgent Delhi applicants depending on document complexity." },
      { question: "Is physical document verification needed in Delhi?", answer: "No, we work with digital scans and photos. The final certificate is also delivered as a high-resolution secured PDF." },
      { question: "Can I include ancestral property in Delhi or NCR?", answer: "Yes, ancestral property can be included if you have ownership documents or a professional valuation report." },
      { question: "What visa types do you cover in Delhi?", answer: "We cover all visa types including Student, Tourist, Business, Spouse, and Permanent Residency categories." }
    ],
    metaTitle: "Net Worth Certificate for Visa in Delhi | CA-Certified",
    metaDescription: "Professional Net Worth Certificate services in Delhi. CA-certified reports with UDIN for all embassies. 100% remote processing and fast delivery."
  }
];

export async function seedLocations() {
  try {
    const q = query(collection(db, 'locations'), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      console.log('Locations already seeded.');
      return;
    }

    console.log('Seeding locations...');
    for (const city of initialCities) {
      await addDoc(collection(db, 'locations'), {
        ...city,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding locations:', error);
  }
}
