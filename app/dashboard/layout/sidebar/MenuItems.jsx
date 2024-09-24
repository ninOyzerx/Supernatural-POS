import {
  IconAperture,
  IconCategory,
  IconCategory2,
  IconCategoryFilled,
  IconCopy,
  IconGrid3x3,
  IconGrid4x4,
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconLogin,
  IconMoodHappy,
  IconPackage,
  IconSettings,
  IconTypography,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "หน้าหลัก",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboardFilled,
    href: "/dashboard",
  },
  {
    navlabel: true,
    subheader: "การจัดการสินค้า",
  },
  {
    id: uniqueId(),
    title: "สินค้า",
    icon: IconPackage,
    href: "/dashboard/manage-products",
  },
  {
    id: uniqueId(),
    title: "หมวดหมู่สินค้า",
    icon: IconCategory,
    href: "/dashboard/manage-categories",
  },
  {
    navlabel: true,
    subheader: "ระบบจัดการผู้ใช้งาน",
  },
  {
    id: uniqueId(),
    title: "ผู้ใช้งาน",
    icon: IconUser,
    href: "/authentication/login",
  },
  {
    id: uniqueId(),
    title: "ตั้งค่า",
    icon: IconSettings,
    href: "/authentication/login",
  },
];

export default Menuitems;
