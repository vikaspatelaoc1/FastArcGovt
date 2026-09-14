import { loadWebsiteControlConfig } from './websiteControlConfig';

export const getDomainName = () => {
  const config = loadWebsiteControlConfig();
  return config.header?.domainName || 'FastArcGovt.info';
};

export const getDomainNameLowercase = () => {
  return getDomainName().toLowerCase();
};
