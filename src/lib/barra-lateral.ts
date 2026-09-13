export const CLAVE_BARRA_LATERAL = "eduqa.barra-lateral";

// Aplica la preferencia antes del primer pintado, sin cambiar el HTML de React.
export const GUION_BARRA_LATERAL = `try{document.documentElement.dataset.sidebar=localStorage.getItem(${JSON.stringify(CLAVE_BARRA_LATERAL)})==="collapsed"?"collapsed":"expanded"}catch{document.documentElement.dataset.sidebar="expanded"}`;
