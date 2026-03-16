export interface MediaAsset {
  key: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  className?: string;
}

export const mediaAssets: Record<string, MediaAsset> = {
  heroVideo: {
    key: "heroVideo",
    type: "image",
    src: "/media/hero/hero-desert.svg",
    alt: "Luxury desert hero visual for Erg Chebbi Luxury"
  },
  camp01: {
    key: "camp01",
    type: "image",
    src: "/media/camp/luxury-camp-01.svg",
    alt: "Luxury camp exterior in Erg Chebbi"
  },
  camp02: {
    key: "camp02",
    type: "image",
    src: "/media/camp/luxury-camp-02.svg",
    alt: "Luxury tent interior with warm desert tones"
  },
  camel01: {
    key: "camel01",
    type: "image",
    src: "/media/camel/camel-sunset-01.svg",
    alt: "Camel ride at sunset over Merzouga dunes"
  },
  camel02: {
    key: "camel02",
    type: "image",
    src: "/media/camel/camel-sunrise-01.svg",
    alt: "Camel silhouette at sunrise in Erg Chebbi"
  },
  quad01: {
    key: "quad01",
    type: "image",
    src: "/media/quad/quad-ride-01.svg",
    alt: "Quad biking through the dunes of Merzouga"
  },
  quad02: {
    key: "quad02",
    type: "image",
    src: "/media/quad/quad-ride-02.svg",
    alt: "ATV riders crossing the desert"
  },
  tour01: {
    key: "tour01",
    type: "image",
    src: "/media/tours/4x4-private-01.svg",
    alt: "Private 4x4 tour in Erg Chebbi"
  },
  tour02: {
    key: "tour02",
    type: "image",
    src: "/media/tours/private-desert-day-01.svg",
    alt: "Private desert exploration day in Merzouga"
  },
  gallery01: {
    key: "gallery01",
    type: "image",
    src: "/media/gallery/gallery-01.svg",
    alt: "Golden dunes at sunset in Erg Chebbi"
  },
  gallery02: {
    key: "gallery02",
    type: "image",
    src: "/media/gallery/gallery-02.svg",
    alt: "Luxury dinner setup in the Sahara"
  },
  gallery03: {
    key: "gallery03",
    type: "image",
    src: "/media/gallery/gallery-03.svg",
    alt: "Camp lanterns at night in Merzouga"
  },
  gallery04: {
    key: "gallery04",
    type: "image",
    src: "/media/gallery/gallery-04.svg",
    alt: "Camel caravan crossing the dunes"
  },
  gallery05: {
    key: "gallery05",
    type: "image",
    src: "/media/gallery/gallery-05.svg",
    alt: "Couple enjoying private desert time"
  },
  gallery06: {
    key: "gallery06",
    type: "image",
    src: "/media/gallery/gallery-06.svg",
    alt: "Quad bikes prepared for a Merzouga ride"
  }
};

export function getMediaAsset(key: string) {
  return mediaAssets[key];
}
