import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getCMSServiceByIdAction } from "@/actions/cmsActions";
import { SERVICES_DATA } from "@/data/servicesData";
import { ServiceFormManager } from "@/components/admin/ServiceFormManager";
import { CMSServiceItem } from "@/types/cms";

export const dynamic = "force-dynamic";

interface AdminServiceEditPageProps {
  params: {
    id: string;
  };
}

export default async function AdminServiceEditPage({
  params,
}: AdminServiceEditPageProps) {
  const isNew = params.id === "new";
  let service: Partial<CMSServiceItem> = {
    id: "new",
    title: "",
    slug: "",
    serviceCategory: "Outstation",
    shortDescription: "",
    fullDescription: "",
    iconName: "Car",
    isFeatured: false,
    status: "published",
    displayOrder: 0,
  };

  if (!isNew) {
    if (params.id.startsWith("static-")) {
      const slug = params.id.replace("static-", "");
      const foundStatic = SERVICES_DATA.find((s) => s.slug === slug);
      if (foundStatic) {
        service = {
          id: params.id,
          title: foundStatic.title,
          slug: foundStatic.slug,
          serviceCategory: foundStatic.category,
          shortDescription: foundStatic.shortDescription,
          fullDescription: foundStatic.fullOverview,
          iconName: foundStatic.iconName,
          isFeatured: true,
          status: "published",
          displayOrder: 1,
          seoTitle: foundStatic.seoTitle,
          metaDescription: foundStatic.seoDescription,
        };
      }
    } else {
      const dbService = await getCMSServiceByIdAction(params.id);
      if (dbService) {
        service = dbService;
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/admin/dashboard" className="hover:text-brand-charcoal-900">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/admin/services" className="hover:text-brand-charcoal-900">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {isNew ? "New Service" : service.title || "Edit Service"}
          </span>
        </nav>

        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Services</span>
        </Link>
      </div>

      {/* Editor */}
      <ServiceFormManager initialData={service} />
    </div>
  );
}
