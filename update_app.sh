sed -i 's/setSiteLogo={setSiteLogo}/setSiteLogo={async (logo) => { setSiteLogo(logo); await saveSiteLogoToFirestore(logo); }}/g' src/App.tsx
