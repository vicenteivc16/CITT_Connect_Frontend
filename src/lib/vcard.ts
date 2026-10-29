import { CittMemberProfile } from '@/types/citt';
import { getCampusBySlug } from '@/data/citt-catalog';

export function buildVCardContent(
  profile: CittMemberProfile,
  publicProfileUrl: string
): string {
  const campus = getCampusBySlug(profile.campusSlug);
  const nameParts = profile.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || profile.fullName;
  const lastName = nameParts.slice(1).join(' ') || '';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${profile.fullName}`,
    `ORG:CITT Duoc UC (${campus.shortName})`,
    `TITLE:${profile.currentOccupation} — ${profile.careerTitle}`,
    `EMAIL;TYPE=INTERNET,PREF:${profile.email}`,
    profile.phoneOptional ? `TEL;TYPE=CELL:${profile.phoneOptional}` : '',
    `URL:${publicProfileUrl}`,
    profile.linkedinUrl ? `ITEM1.URL:${profile.linkedinUrl}` : '',
    profile.linkedinUrl ? 'ITEM1.X-ABLabel:LinkedIn' : '',
    profile.githubUrl ? `ITEM2.URL:${profile.githubUrl}` : '',
    profile.githubUrl ? 'ITEM2.X-ABLabel:GitHub' : '',
    profile.portfolioUrl ? `ITEM3.URL:${profile.portfolioUrl}` : '',
    profile.portfolioUrl ? 'ITEM3.X-ABLabel:Portafolio' : '',
    `NOTE:Especialidades CITT: ${profile.specialties.join(', ')}`,
    'END:VCARD',
  ];

  return lines.filter(Boolean).join('\r\n');
}

export function downloadMemberVCard(
  profile: CittMemberProfile,
  publicProfileUrl: string
): void {
  const content = buildVCardContent(profile, publicProfileUrl);
  const blob = new Blob([content], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${profile.username}-citt-connect.vcf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
