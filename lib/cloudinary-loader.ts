'use client'

type LoaderParams = { src: string; width: number; quality?: number }

export default function cloudinaryLoader({ src, width, quality }: LoaderParams): string {
  if (src.includes('res.cloudinary.com')) {
    const params = `w_${width},q_${quality ?? 'auto'},f_webp,c_limit`
    return src.replace('/upload/', `/upload/${params}/`)
  }
  if (src.includes('lh3.googleusercontent.com')) {
    return src.replace(/=s\d+-c/, `=s${width}-c`)
  }
  return src
}
