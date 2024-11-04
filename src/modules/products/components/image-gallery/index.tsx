import { Image as MedusaImage } from "@medusajs/medusa"
import { Container } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: MedusaImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="relative flex items-start">
      <div className="flex flex-col flex-1 xsmall:mx-4 gap-y-4 max-w-[300px]">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
              id={image.id}
            >
              <Image
                src={image.url}
                priority={index <= 2 ? true : false}
                className="absolute inset-0 rounded-rounded"
                alt={`Product image ${index + 1}`}
                fill
                sizes="(max-width: 576px) 50px, (max-width: 768px) 70px, (max-width: 992px) 90px, 150px"
                style={{
                  objectFit: "cover",
                }}
              />
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
