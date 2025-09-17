// src/components/GTMRouteChange.jsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Componente invisível que dispara "page_view" no dataLayer a cada mudança de rota.
 */
export default function GTMRouteChange(){
  const { pathname, search } = useLocation();

  useEffect(() => {
    track("page_view", {
      page_path: pathname + search,
      page_location: window.location.href,
    });
  }, [pathname, search]);

  return null;
}
