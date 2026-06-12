import type { FaqItem } from "../types/data";

const COMMON_FAQ: FaqItem[] = [
  {
    question: "How to start with this design system?",
    answerHtml: "After the successful purchase via Gumroad (it's safe and encrypted) you will be taken to a download page. You will also get the download link in your email (check the SPAM folder sometimes). Then just simply drag and drop .FIG file onto your Figma app. Do not drop it onto the project. Drop it over the starting screen with recent projects grid.",
  },
  {
    question: "l am new to Figma. Should I try your kits?",
    answerHtml: "<strong>Definitely! </strong>Our products help customers who learning Figma from scratch. By exploring and studying commercial UI kits you learn how the components and layouts were crafted, which styles being used and which styling tricks have been applied.",
  },
  {
    question: "How to import your kits?",
    answerHtml: 'Importing .FIG files into Figma: <a class="span-link" href="https://help.figma.com/hc/en-us/articles/360041003114-Import-files-to-the-file-browser" target="_blank">https://help.figma.com/hc/en-us/articles/360041003114-Import-files-to-the-file-browser</a>',
  },
  {
    question: "Which license type should I choose?",
    answerHtml: "You must select the proper license type according to the number of users in Figma if you're purchasing our product for the business.<br/><br/><strong>Business license</strong> — for startups or enterprise organizations to use for a local team or publish in Figma library.<br/><strong>Individual license</strong> — for freelancers, indie developers, or solopreneurs working on a single project.",
  },
  {
    question: "Can I build commercial proiects with your products?",
    answerHtml: '<strong>Yes!</strong> You can build an unlimited amount of commercial projects using Setproduct assets. But, please, <em>consider a license type</em> before making a purchase.',
  },
  {
    question: "I have a project. Can I hire you?",
    answerHtml: 'We\'re open-minded to your custom design &amp; development projects. We can create complex templates based on our Figma libraries and code them in the production using a wide variety of popular frameworks and technologies.<br/><br/>If you have a project to design &amp; develop, simply <a data-remodal-target="modal2" href="#"><span class="span-link">contact us</span></a> describing your brief, budget, and expectations.',
  },
  {
    question: "I 💜 Your designs, but can I have a discount?",
    answerHtml: 'We provide discounts for those, who scrolled to the bottom and revealed our proposal. Just <a data-remodal-target="modal2" href="#"><span class="span-link">drop us a message</span></a> with a short story about how you plan to use our product and we will give you a ✨<strong>30% off coupon</strong> for the upcoming purchase. Please, provide a specific product name you\'ve put your eye on.',
  },
];

const DASHBOARDS_EXTRA_FAQ: FaqItem[] = [
  {
    question: "How do I start with the design system after purchase?",
    answerHtml: "After the successful purchase via Gumroad (it's safe and encrypted) you will be taken to a download page. You will also get the download link in your email. Then just simply drag and drop .FIG file onto your Figma app.",
  },
  {
    question: "Do your dashboard UI templates support responsive design?",
    answerHtml: "Yes, our Figma dashboard UI kits are designed with responsive design principles in mind. They include components and layouts that adapt to different screen sizes, ensuring your web application looks great on both desktop and mobile devices.",
  },
  {
    question: "Can I customize the color scheme and branding of the dashboard templates?",
    answerHtml: "Absolutely! Our dashboard UI templates come with customizable color schemes and branding options. You can easily adapt the design to match your brand's visual identity by modifying the color variables and styles within Figma.",
  },
  {
    question: "How can I use dashboard templates to improve business performance?",
    answerHtml: "Dashboard templates help streamline data visualization and decision-making processes. By using well-designed templates, you can present complex data in an easily digestible format, enabling faster insights and better-informed business decisions.",
  },
  {
    question: "Are there any restrictions on the usage or distribution of the dashboard templates?",
    answerHtml: "Our templates come with flexible licensing options. Individual licenses are for personal or freelance use, while business licenses allow team usage. You cannot resell or redistribute the templates as standalone products.",
  },
  {
    question: "How frequently are your Figma dashboard UI kits updated with new features or components?",
    answerHtml: "We regularly update our UI kits with new components, templates, and improvements. Updates are free for existing customers and are delivered through Gumroad.",
  },
];

const HOME_FAQ: FaqItem[] = [
  // GROUP A — AI UI inspiration gallery
  {
    question: "What is the AI UI inspiration gallery?",
    answerHtml:
      'The Setproduct AI UI inspiration gallery is a searchable library of AI-generated UI examples: buttons, cards, tabs, and full layouts you can browse by component. Like anything to save it to your personal library, and check back often since we add new images weekly. Try it on the <a class="span-link" href="https://app.setproduct.com" target="_blank" rel="noopener noreferrer">Setproduct app</a>.',
  },
  {
    question: "How is it different from Dribbble, Mobbin, or other inspiration sites?",
    answerHtml:
      'The key difference is that Setproduct shows AI-generated references, not real shipped products, so there\'s no legal risk if a pattern inspires your work. The component search also makes it faster to find exactly what you need. It\'s built for brainstorming, not pixel-copying. There\'s more on that in <a class="span-link" href="/blog/how-to-use-ai-ui-inspiration-to-design-faster-without-copying-blindly">this guide</a>.',
  },
  {
    question: "Can I use AI-generated UI ideas in client projects?",
    answerHtml:
      'Yes, you can use them as inspiration rather than finished assets. The healthy way is to study a layout, understand why it works, then design your own version. Copying a visual one-to-one isn\'t the point and won\'t serve your client. We wrote about getting more out of these examples in <a class="span-link" href="/blog/how-to-get-better-at-ui-design-by-studying-ai-generated-examples">studying AI-generated UI</a>.',
  },
  // GROUP B — Figma UI kits and templates
  {
    question: "Which UI kit should I start with as a beginner?",
    answerHtml:
      'Start with the kit that matches your goal. For SaaS, try <a class="span-link" href="/templates/material-you">Material You</a> or <a class="span-link" href="/templates/eclipse">Eclipse</a>. For an AI product, <a class="span-link" href="/templates/nocra">Nocra</a>. For landing pages, <a class="span-link" href="/templates/zeus">Zeus</a>. For mobile, <a class="span-link" href="/templates/mobile-x">Mobile X</a>. For data viz, <a class="span-link" href="/templates/charts">Charts</a> or <a class="span-link" href="/templates/orion">Orion</a>. Browse everything on the <a class="span-link" href="/all">full catalog</a>.',
  },
  {
    question: "Do you offer a free Figma UI kit?",
    answerHtml:
      'Yes, Setproduct offers free Figma UI kits you can use right away. Head to <a class="span-link" href="/freebies">freebies</a> to duplicate them into your own Figma account at no cost. They\'re a good way to try the build quality and component structure before buying a full kit.',
  },
  {
    question: "What's the difference between a UI kit and a design system?",
    answerHtml:
      'A UI kit is a set of ready-made components and screens you can drop into a project. A design system goes further, adding the rules, tokens, and documentation that keep those components consistent at scale. Most Setproduct products are full design systems, not just loose component packs. Browse them on the <a class="span-link" href="/all">catalog</a>.',
  },
  {
    question: "I'm new to Figma. Can I still use your kits?",
    answerHtml:
      'Yes, beginners can absolutely use them. Every Setproduct kit is documented, so you can learn by exploring how real components and layouts are built. A good starting point is our <a class="span-link" href="/freebies">free freebies</a>, no purchase needed. The <a class="span-link" href="/blog">blog</a> also has tutorials to help you find your way around Figma.',
  },
  {
    question: "How do I import a kit into Figma or React?",
    answerHtml:
      'To import a kit in Figma, add it as a team library: open the file, hit "Publish library," then enable it across your projects. Most kits are Figma-only. If you specifically need design paired with code, the <a class="span-link" href="/templates/react-ui-kit">React UI kit</a> covers the Figma plus React workflow, with components you can install and use directly.',
  },
  {
    question: "Can I build commercial projects with your products?",
    answerHtml:
      'Yes, the license allows it. One kit covers an unlimited number of commercial projects for a single person or company, with no per-project fee. Just pick the license tier that matches your team size before buying. Full details are on the <a class="span-link" href="/legal/license">license page</a>.',
  },
  {
    question: "Which license type should I choose?",
    answerHtml:
      'Personal is for a single designer, so freelancers and solo builders. Team is for agencies and groups of five or more designers sharing the files. Enterprise is for larger companies that also need distribution rights. If you\'re unsure, the <a class="span-link" href="/legal/license">license page</a> breaks down exactly what each one covers.',
  },
  // GROUP C — Blog and learning content
  {
    question: "What kind of content do you publish on the blog?",
    answerHtml:
      'The Setproduct blog publishes practical UI design guides, with deep dives into components like buttons, tabs, and tooltips, plus design trends, startup advice, growth tactics, AI tools for designers, and research-backed UX articles. It\'s written to be useful, not filler. Have a look at the <a class="span-link" href="/blog">blog</a>.',
  },
  {
    question: "Do you cover topics beyond UI design?",
    answerHtml:
      'Yes. We also write about running a SaaS, marketing on a tight budget, and AI tooling. One of our most-read pieces is a guide on <a class="span-link" href="/blog/pay-for-claude-pro-with-usdt">paying for Claude with crypto</a> when cards aren\'t an option, handy if you\'re outside the regions these services support.',
  },
  // GROUP D — Pricing, payment, discounts
  {
    question: "Do you offer discounts or bundles?",
    answerHtml:
      'Yes, Setproduct offers both. The <a class="span-link" href="/bundle">bundle</a> packs several kits together at a lower combined price, and we run seasonal sales fairly often. Newsletter subscribers hear about discounts first, so sign up at the bottom of any page to stay in the loop.',
  },
  {
    question: "Can I pay with cryptocurrency?",
    answerHtml:
      'Checkout runs through Gumroad, which supports card and PayPal. If those aren\'t available to you, you can fund a virtual crypto card and pay that way. We walk through it in <a class="span-link" href="/blog/pay-for-claude-pro-with-usdt">paying with USDT</a> and our <a class="span-link" href="/blog/solcard-review-usdt-crypto-card-that-actually-helps-pay-for-online-subscriptions">SolCard review</a>.',
  },
  // GROUP E — Hire and collaboration
  {
    question: "I have a project. Can I hire you?",
    answerHtml:
      'Yes, we take on custom design and development work, often building on top of our own Figma libraries. Tell us about your brief, budget, and timeline through the <a class="span-link" data-contact href="#">contact form</a>, and we\'ll let you know if it\'s a fit.',
  },
  {
    question: "Can I write a guest post for your blog?",
    answerHtml:
      'Yes, we accept guest posts on design and technology topics. Submission guidelines and pricing live on our publishing portal, see <a class="span-link" href="https://publish.setproduct.com/" target="_blank" rel="noopener noreferrer">publish.setproduct.com</a>.',
  },
];

export const PAGE_FAQ: Record<string, FaqItem[]> = {
  index: HOME_FAQ,
  all: COMMON_FAQ,
  dashboards: [...DASHBOARDS_EXTRA_FAQ.slice(0, 2), COMMON_FAQ[2], DASHBOARDS_EXTRA_FAQ[2], ...COMMON_FAQ.slice(6), ...DASHBOARDS_EXTRA_FAQ.slice(3)],
  mobile: COMMON_FAQ,
  code: COMMON_FAQ,
  dataviz: COMMON_FAQ,
  websites: COMMON_FAQ,
  bundle: COMMON_FAQ,
};
