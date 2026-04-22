export { chartsContent } from "./charts";
export { android_ui_kitContent } from "./android-ui-kit";
export { appka_ios_ui_kitContent } from "./appka-ios-ui-kit";
export { eclipseContent } from "./eclipse";
export { full_iosContent } from "./full-ios";
export { hyper_chartsContent } from "./hyper-charts";
export { ios_ui_kitContent } from "./ios-ui-kit";
export { landingContent } from "./landing";
export { levitateContent } from "./levitate";
export { materialContent } from "./material";
export { material_desktopContent } from "./material-desktop";
export { material_xContent } from "./material-x";
export { material_youContent } from "./material-you";
export { mobile_xContent } from "./mobile-x";
export { mostContent } from "./most";
export { neolex_dashboardContent } from "./neolex-dashboard";
export { nocraContent } from "./nocra";
export { nucleus_uiContent } from "./nucleus-ui";
export { oe_enterpriseContent } from "./oe-enterprise";
export { orionContent } from "./orion";
export { pandaContent } from "./panda";
export { react_ui_kitContent } from "./react-ui-kit";
export { romeContent } from "./rome";
export { s8Content } from "./s8";
export { websiteContent } from "./website";
export { xelaContent } from "./xela";
export { xela_androidContent } from "./xela-android";
export { xela_flutterContent } from "./xela-flutter";
export { xela_reactContent } from "./xela-react";
export { xela_swiftContent } from "./xela-swift";
export { zeusContent } from "./zeus";

// Content map by slug
export const templateContentMap: Record<string, unknown> = {
  "charts": undefined, // Uses dedicated ChartsTemplatePage
  "android-ui-kit": undefined,
  "appka-ios-ui-kit": undefined,
  "eclipse": undefined,
  "full-ios": undefined,
  "hyper-charts": undefined,
  "ios-ui-kit": undefined,
  "landing": undefined,
  "levitate": undefined,
  "material": undefined,
  "material-desktop": undefined,
  "material-x": undefined,
  "material-you": undefined,
  "mobile-x": undefined,
  "most": undefined,
  "neolex-dashboard": undefined,
  "nocra": undefined,
  "nucleus-ui": undefined,
  "oe-enterprise": undefined,
  "orion": undefined,
  "panda": undefined,
  "react-ui-kit": undefined,
  "rome": undefined,
  "s8": undefined,
  "website": undefined,
  "xela": undefined,
  "xela-android": undefined,
  "xela-flutter": undefined,
  "xela-react": undefined,
  "xela-swift": undefined,
  "zeus": undefined,
};

// Lazy load content to avoid bundling everything
export async function getTemplateContent(slug: string) {
  switch (slug) {
    case "android-ui-kit":
      return (await import("./android-ui-kit")).android_ui_kitContent;
    case "appka-ios-ui-kit":
      return (await import("./appka-ios-ui-kit")).appka_ios_ui_kitContent;
    case "eclipse":
      return (await import("./eclipse")).eclipseContent;
    case "full-ios":
      return (await import("./full-ios")).full_iosContent;
    case "hyper-charts":
      return (await import("./hyper-charts")).hyper_chartsContent;
    case "ios-ui-kit":
      return (await import("./ios-ui-kit")).ios_ui_kitContent;
    case "landing":
      return (await import("./landing")).landingContent;
    case "levitate":
      return (await import("./levitate")).levitateContent;
    case "material":
      return (await import("./material")).materialContent;
    case "material-desktop":
      return (await import("./material-desktop")).material_desktopContent;
    case "material-x":
      return (await import("./material-x")).material_xContent;
    case "material-you":
      return (await import("./material-you")).material_youContent;
    case "mobile-x":
      return (await import("./mobile-x")).mobile_xContent;
    case "most":
      return (await import("./most")).mostContent;
    case "neolex-dashboard":
      return (await import("./neolex-dashboard")).neolex_dashboardContent;
    case "nocra":
      return (await import("./nocra")).nocraContent;
    case "nucleus-ui":
      return (await import("./nucleus-ui")).nucleus_uiContent;
    case "oe-enterprise":
      return (await import("./oe-enterprise")).oe_enterpriseContent;
    case "orion":
      return (await import("./orion")).orionContent;
    case "panda":
      return (await import("./panda")).pandaContent;
    case "react-ui-kit":
      return (await import("./react-ui-kit")).react_ui_kitContent;
    case "rome":
      return (await import("./rome")).romeContent;
    case "s8":
      return (await import("./s8")).s8Content;
    case "website":
      return (await import("./website")).websiteContent;
    case "xela":
      return (await import("./xela")).xelaContent;
    case "xela-android":
      return (await import("./xela-android")).xela_androidContent;
    case "xela-flutter":
      return (await import("./xela-flutter")).xela_flutterContent;
    case "xela-react":
      return (await import("./xela-react")).xela_reactContent;
    case "xela-swift":
      return (await import("./xela-swift")).xela_swiftContent;
    case "zeus":
      return (await import("./zeus")).zeusContent;
    default:
      return null;
  }
}
