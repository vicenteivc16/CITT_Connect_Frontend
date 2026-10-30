/**
 * Extrae la URL de incrustación (embed) de YouTube u otros proveedores de video
 * para reproducir directamente dentro de la plataforma sin redirigir al usuario.
 */
export function getEmbedVideoUrl(url?: string): {
  embedUrl: string | null;
  provider: 'youtube' | 'vimeo' | 'direct' | 'unknown';
} {
  if (!url) return { embedUrl: null, provider: 'unknown' };

  const cleanUrl = url.trim();

  // YouTube (soporta youtube.com/watch?v=, youtu.be/, youtube.com/embed/, shorts)
  const ytRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = cleanUrl.match(ytRegex);

  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
      provider: 'youtube',
    };
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/;
  const vimeoMatch = cleanUrl.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
      provider: 'vimeo',
    };
  }

  // Video directo (.mp4, .webm)
  if (cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm')) {
    return {
      embedUrl: cleanUrl,
      provider: 'direct',
    };
  }

  return { embedUrl: null, provider: 'unknown' };
}
