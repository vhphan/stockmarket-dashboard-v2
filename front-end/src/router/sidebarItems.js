import {basePath} from "@/config/constants";

export const sidebarItems = [
    {
        to: `${basePath}page1`,
        icon: "inbox",
        label: "Page 1",
        id: 1,
        routeName: 'Page1',
    },
    {
        to: `${basePath}page2`,
        icon: "send",
        label: "Page 2",
        id: 2,
        routeName: 'Page2',
    }
];