import type { FaqItem } from "../types/data";

const COMMON_FAQ: FaqItem[] = [
  {
    question: "How to start with this design system?",
    answer: "After the successful purchase via Gumroad (it's safe and encrypted) you will be taken to a download page. You will also get the download link in your email (check the SPAM folder sometimes). Then just simply drag and drop .FIG file onto your Figma app. Do not drop it onto the project. Drop it over the starting screen with recent projects grid.",
  },
  {
    question: "l am new to Figma. Should I try your kits?",
    answer: "Definitely! Our products help customers who learning Figma from scratch. By exploring and studying commercial UI kits you learn how the components and layouts were crafted, which styles being used and which styling tricks have been applied.",
  },
  {
    question: "How to import your kits?",
    answer: "Importing .FIG files into Figma: https://help.figma.com/hc/en-us/articles/360041003114-Import-files-to-the-file-browser",
  },
  {
    question: "Which license type should I choose?",
    answer: "You must select the proper license type according to the number of users in Figma if you're purchasing our product for the business. Business license — for startups or enterprise organizations to use for a local team or publish in Figma library. Individual license — for freelancers, indie developers, or solopreneurs working on a single project.",
  },
  {
    question: "Can I build commercial projects with your products?",
    answer: "Yes! You can build an unlimited amount of commercial projects using Setproduct assets. But, please, consider a license type before making a purchase.",
  },
  {
    question: "I have a project. Can I hire you?",
    answer: "We're open-minded to your custom design & development projects. We can create complex templates based on our Figma libraries and code them in the production using a wide variety of popular frameworks and technologies. If you have a project to design & develop, simply contact us describing your brief, budget, and expectations.",
  },
  {
    question: "I love Your designs, but can I have a discount?",
    answer: "We provide discounts for those, who scrolled to the bottom and revealed our proposal. Just drop us a message with a short story about how you plan to use our product and we will give you a 30% off coupon for the upcoming purchase. Please, provide a specific product name you've put your eye on.",
  },
];

const DASHBOARDS_EXTRA_FAQ: FaqItem[] = [
  {
    question: "How do I start with the design system after purchase?",
    answer: "After the successful purchase via Gumroad (it's safe and encrypted) you will be taken to a download page. You will also get the download link in your email. Then just simply drag and drop .FIG file onto your Figma app.",
  },
  {
    question: "Do your dashboard UI templates support responsive design?",
    answer: "Yes, our Figma dashboard UI kits are designed with responsive design principles in mind. They include components and layouts that adapt to different screen sizes, ensuring your web application looks great on both desktop and mobile devices.",
  },
  {
    question: "Can I customize the color scheme and branding of the dashboard templates?",
    answer: "Absolutely! Our dashboard UI templates come with customizable color schemes and branding options. You can easily adapt the design to match your brand's visual identity by modifying the color variables and styles within Figma.",
  },
  {
    question: "How can I use dashboard templates to improve business performance?",
    answer: "Dashboard templates help streamline data visualization and decision-making processes. By using well-designed templates, you can present complex data in an easily digestible format, enabling faster insights and better-informed business decisions.",
  },
  {
    question: "Are there any restrictions on the usage or distribution of the dashboard templates?",
    answer: "Our templates come with flexible licensing options. Individual licenses are for personal or freelance use, while business licenses allow team usage. You cannot resell or redistribute the templates as standalone products.",
  },
  {
    question: "How frequently are your Figma dashboard UI kits updated with new features or components?",
    answer: "We regularly update our UI kits with new components, templates, and improvements. Updates are free for existing customers and are delivered through Gumroad.",
  },
];

export const PAGE_FAQ: Record<string, FaqItem[]> = {
  index: COMMON_FAQ,
  dashboards: [...DASHBOARDS_EXTRA_FAQ.slice(0, 2), COMMON_FAQ[2], DASHBOARDS_EXTRA_FAQ[2], ...COMMON_FAQ.slice(6), ...DASHBOARDS_EXTRA_FAQ.slice(3)],
  mobile: COMMON_FAQ,
  code: COMMON_FAQ,
  dataviz: COMMON_FAQ,
  websites: COMMON_FAQ,
};
