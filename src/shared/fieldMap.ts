import { FieldKey } from '../storage/types';

export interface FieldMatcher {
  keywords: string[];
  types: string[];
  ariaLabels: string[];
  autocomplete: string[];
}

export const FIELD_MAP: Record<FieldKey, FieldMatcher> = {
  firstName: {
    keywords: ['first', 'fname', 'firstname', 'given', 'forename', 'givenname'],
    types: ['text'],
    ariaLabels: ['first name', 'given name'],
    autocomplete: ['given-name'],
  },
  lastName: {
    keywords: ['last', 'lname', 'lastname', 'surname', 'family', 'familyname'],
    types: ['text'],
    ariaLabels: ['last name', 'surname', 'family name'],
    autocomplete: ['family-name'],
  },
  fullName: {
    keywords: ['fullname', 'name', 'yourname', 'displayname'],
    types: ['text'],
    ariaLabels: ['full name', 'your name', 'name'],
    autocomplete: ['name'],
  },
  email: {
    keywords: ['email', 'mail', 'e-mail', 'emailaddress'],
    types: ['email', 'text'],
    ariaLabels: ['email', 'email address'],
    autocomplete: ['email'],
  },
  phone: {
    keywords: ['phone', 'mobile', 'tel', 'telephone', 'cell', 'contact', 'phonenumber'],
    types: ['tel', 'text', 'number'],
    ariaLabels: ['phone', 'mobile number', 'telephone'],
    autocomplete: ['tel'],
  },
  company: {
    keywords: ['company', 'organisation', 'organization', 'employer', 'business', 'firm', 'corp'],
    types: ['text'],
    ariaLabels: ['company', 'organisation', 'employer'],
    autocomplete: ['organization'],
  },
  jobTitle: {
    keywords: ['job', 'title', 'role', 'position', 'profession', 'occupation'],
    types: ['text'],
    ariaLabels: ['job title', 'role', 'position'],
    autocomplete: ['organization-title'],
  },
  address1: {
    keywords: ['address', 'address1', 'line1', 'street'],
    types: ['text'],
    ariaLabels: ['address', 'address line 1', 'street address'],
    autocomplete: ['address-line1'],
  },
  address2: {
    keywords: ['address2', 'line2', 'apartment', 'suite', 'unit', 'building', 'floor'],
    types: ['text'],
    ariaLabels: ['address line 2', 'apartment', 'suite'],
    autocomplete: ['address-line2'],
  },
  city: {
    keywords: ['city', 'town', 'locality', 'suburb'],
    types: ['text'],
    ariaLabels: ['city', 'town'],
    autocomplete: ['address-level2'],
  },
  state: {
    keywords: ['state', 'province', 'region', 'county'],
    types: ['text'],
    ariaLabels: ['state', 'province', 'region'],
    autocomplete: ['address-level1'],
  },
  zip: {
    keywords: ['zip', 'zipcode', 'postal', 'postcode', 'pin'],
    types: ['text', 'number'],
    ariaLabels: ['zip code', 'postal code', 'post code'],
    autocomplete: ['postal-code'],
  },
  country: {
    keywords: ['country', 'nation'],
    types: ['text'],
    ariaLabels: ['country'],
    autocomplete: ['country', 'country-name'],
  },
  website: {
    keywords: ['website', 'url', 'site', 'portfolio', 'homepage'],
    types: ['url', 'text'],
    ariaLabels: ['website', 'portfolio', 'url'],
    autocomplete: ['url'],
  },
  linkedin: {
    keywords: ['linkedin', 'linked', 'lnkd'],
    types: ['url', 'text'],
    ariaLabels: ['linkedin', 'linkedin url', 'linkedin profile'],
    autocomplete: [],
  },
  github: {
    keywords: ['github', 'git'],
    types: ['url', 'text'],
    ariaLabels: ['github', 'github url', 'github profile'],
    autocomplete: [],
  },
  twitter: {
    keywords: ['twitter', 'x', 'tweet'],
    types: ['url', 'text'],
    ariaLabels: ['twitter', 'twitter url', 'x profile'],
    autocomplete: [],
  }
};
