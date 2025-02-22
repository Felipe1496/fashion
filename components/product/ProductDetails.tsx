import { useId } from "preact/hooks";
import AddToCartButton from "$store/islands/AddToCartButton.tsx";
import ShippingSimulation from "$store/islands/ShippingSimulation.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Image from "deco-sites/std/components/Image.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/components/ui/SliderJS.tsx";
import OutOfStock from "$store/islands/OutOfStock.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { mapProductToAnalyticsItem } from "deco-sites/std/commerce/utils/productToAnalyticsItem.ts";
import type { ProductDetailsPage } from "deco-sites/std/commerce/types.ts";
import type { LoaderReturnType } from "$live/types.ts";

import ProductSelector from "./ProductVariantSelector.tsx";
import ProductImageZoom from "$store/islands/ProductImageZoom.tsx";
import WishlistButton from "../wishlist/WishlistButton.tsx";

export type Variant = "front-back" | "slider" | "auto";

export type ImagesLayout =
  | "down-preview"
  | "side-by-side"
  | "vertical-galery"
  | "horizontal-galery";

export interface Props {
  page: LoaderReturnType<ProductDetailsPage | null>;
  /**
   * @title Product view
   * @description Ask for the developer to remove this option since this is here to help development only and should not be used in production
   */
  variant?: Variant;
  /**
   * @title Images Layout
   * @description Ask for the developer to select the layout of the images view
   */
  imagesLayout: ImagesLayout;
}

const WIDTH = 360;
const HEIGHT = 500;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

/**
 * Rendered when a not found is returned by any of the loaders run on this page
 */
function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-28">
      <div class="flex flex-col items-center justify-center gap-6">
        <span class="font-medium text-2xl">Página não encontrada</span>
        <a href="/">
          <Button>Voltar à página inicial</Button>
        </a>
      </div>
    </div>
  );
}

function ProductInfo(
  { page }: { page: ProductDetailsPage },
) {
  const {
    breadcrumbList,
    product,
  } = page;
  const {
    description,
    productID,
    offers,
    name,
    gtin,
    isVariantOf,
  } = product;
  const { price, listPrice, seller, installments, availability } = useOffer(
    offers,
  );

  return (
    <>
      <Breadcrumb
        itemListElement={breadcrumbList?.itemListElement.slice(0, -1)}
      />
      {/* Code and name */}
      <div class="mt-4 sm:mt-8">
        <div>
          <span class="text-sm text-base-300">
            Cod. {gtin}
          </span>
        </div>
        <h1>
          <span class="font-medium text-xl">{name}</span>
        </h1>
        {description && <span class="text-zinc-500">{description}</span>}
      </div>
      {/* Prices */}
      <div class="mt-4">
        <div class="flex flex-row gap-2 items-center">
          <span class="line-through text-base-300 text-xs">
            {formatPrice(listPrice, offers!.priceCurrency!)}
          </span>
          <span class="font-medium text-xl text-secondary">
            {formatPrice(price, offers!.priceCurrency!)}
          </span>
        </div>
        <span class="text-sm text-base-300">
          {installments}
        </span>
      </div>
      {/* Sku Selector */}
      <div class="mt-4 sm:mt-6">
        <ProductSelector product={product} />
      </div>
      {/* Add to Cart and Favorites button */}
      <div class="mt-4 sm:mt-10 flex flex-col gap-2">
        {availability === "https://schema.org/InStock"
          ? (
            <>
              {seller && (
                <AddToCartButton
                  skuId={productID}
                  sellerId={seller}
                  price={price ?? 0}
                  discount={price && listPrice ? listPrice - price : 0}
                  name={product.name ?? ""}
                  productGroupId={product.isVariantOf?.productGroupID ?? ""}
                />
              )}
              <WishlistButton
                variant="full"
                productGroupID={isVariantOf?.productGroupID}
                productID={productID}
              />
            </>
          )
          : <OutOfStock productID={productID} />}
      </div>
      {/* Shipping Simulation */}
      <div class="mt-8">
        <ShippingSimulation
          items={[{
            id: Number(product.sku),
            quantity: 1,
            seller: seller ?? "1",
          }]}
        />
      </div>

      {/* email */}
      <div class="border-2 border-zinc-300 p-4 flex flex-col items-start gap-4">
        <h2 class="text-lg">
          Me notifique quando o produto estiver disponível
        </h2>

        <div>
          <label class="flex flex-col">
            E-mail
          </label>
          <div class="flex items-center justify-center gap-2">
            <input
              class="p-2 border-2 border-zinc-300"
              type="text"
              placeholder="seu.email@exemplo.com"
            />

            <button class="p-2 bg-[#273746] text-zinc-100">
              Notifique-me
            </button>
          </div>
        </div>
      </div>
      {/* Description card */}
      {
        <>
          <div
            tabIndex={0}
            className="collapse collapse-arrow border-t border-zinc-300 bg-base-100"
          >
            <div className="collapse-title text-xl font-medium text-zinc-700">
              Detalhes
            </div>
            <div className="collapse-content">
              <p className="text-zinc-500 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros elementum tristique. Duis
                cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
                commodo diam libero vitae erat. Aenean faucibus nibh et justo
                cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus
                tristique posuere.
              </p>
            </div>
          </div>
          <div
            tabIndex={1}
            className="collapse collapse-arrow border-t border-zinc-300 bg-base-100"
          >
            <div className="collapse-title text-xl font-medium text-zinc-700">
              Returns
            </div>
            <div className="collapse-content">
              <p className="text-zinc-500 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros elementum tristique. Duis
                cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
                commodo diam libero vitae erat. Aenean faucibus nibh et justo
                cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus
                tristique posuere.
              </p>
            </div>
          </div>
          <div
            tabIndex={2}
            className="collapse collapse-arrow border-t border-zinc-300 bg-base-100"
          >
            <div className="collapse-title text-xl font-medium text-zinc-700">
              Entrega
            </div>
            <div className="collapse-content">
              <p className="text-zinc-500 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros elementum tristique. Duis
                cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
                commodo diam libero vitae erat. Aenean faucibus nibh et justo
                cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus
                tristique posuere.
              </p>
            </div>
          </div>
        </>
      }
      {/* Analytics Event */}
      <SendEventOnLoad
        event={{
          name: "view_item",
          params: {
            items: [
              mapProductToAnalyticsItem({
                product,
                breadcrumbList,
                price,
                listPrice,
              }),
            ],
          },
        }}
      />
    </>
  );
}

/**
 * Here be dragons
 *
 * bravtexfashionstore (VTEX default fashion account) has the same images for different skus. However,
 * VTEX api does not return the same link for the same image. This causes the image to blink when
 * the user changes the selected SKU. To prevent this blink from happening, I created this function
 * bellow to use the same link for all skus. Example:
 *
 * {
    skus: [
      {
        id: 1
        image: [
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/123/a.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/124/b.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/125/c.jpg"
        ]
      },
      {
        id: 2
        image: [
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/321/a.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/322/b.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/323/c.jpg"
        ]
      }
    ]
  }

  for both skus 1 and 2, we have the same images a.jpg, b.jpg and c.jpg, but
  they have different urls. This function returns, for both skus:

  [
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/321/a.jpg",
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/322/b.jpg",
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/323/c.jpg"
  ]

  This is a very catalog dependent function. Feel free to change this as you wish
 */
const useStableImages = (product: ProductDetailsPage["product"]) => {
  const imageNameFromURL = (url = "") => {
    const segments = new URL(url).pathname.split("/");
    return segments[segments.length - 1];
  };

  const images = product.image ?? [];
  const allImages = product.isVariantOf?.hasVariant.flatMap((p) => p.image)
    .reduce((acc, img) => {
      if (img?.url) {
        acc[imageNameFromURL(img.url)] = img.url;
      }
      return acc;
    }, {} as Record<string, string>) ?? {};

  return images.map((img) => {
    const name = imageNameFromURL(img.url);

    return { ...img, url: allImages[name] ?? img.url };
  });
};

function Details({
  page,
  variant,
  imagesLayout,
  details,
}: {
  page: ProductDetailsPage;
  variant: Variant;
  imagesLayout: ImagesLayout;
  details?: string;
}) {
  const { product } = page;
  const id = `product-image-gallery:${useId()}`;
  product.image = product.image = [{
    "@type": "ImageObject",
    alternateName: "Vestido Branco",
    url:
      "https://bravtexfashionstore.vtexassets.com/arquivos/ids/155631/vestido-branco.jpg?v=1770218403",
  }, {
    "@type": "ImageObject",
    alternateName: "Vestido Rosa",
    url:
      "https://bravtexfashionstore.vtexassets.com/arquivos/ids/155631/vestido-branco.jpg?v=1770218403",
  }, {
    "@type": "ImageObject",
    alternateName: "Vestido Azul",
    url:
      "https://bravtexfashionstore.vtexassets.com/arquivos/ids/155631/vestido-branco.jpg?v=1770218403",
  }, {
    "@type": "ImageObject",
    alternateName: "Vestido Roxo",
    url:
      "https://bravtexfashionstore.vtexassets.com/arquivos/ids/155631/vestido-branco.jpg?v=1770218403",
  }, {
    "@type": "ImageObject",
    alternateName: "Vestido NHa",
    url:
      "https://bravtexfashionstore.vtexassets.com/arquivos/ids/155631/vestido-branco.jpg?v=1770218403",
  }];

  const images = useStableImages(product);

  /**
   * Product slider variant
   *
   * Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
   * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
   * we rearrange each cell with col-start- directives
   */
  if (variant === "slider") {
    console.log("miseraaaa", imagesLayout);
    return (
      <>
        <div
          id={id}
          class="flex gap-4 sm:justify-center"
        >
          {imagesLayout !== "vertical-galery" && (
            <div
              class={`${imagesLayout === "down-preview" ? "flex-col" : ""} ${
                imagesLayout === "side-by-side" && "flex-row-reverse w-[60%]"
              } flex w-[40%]`}
            >
              {/* Image Slider */}
              <div
                class={`${
                  imagesLayout === "side-by-side" && "w-[80%]"
                } relative`}
              >
                <Slider class="carousel gap-6">
                  {images.map((img, index) => (
                    <Slider.Item
                      index={index}
                      class="carousel-item min-w-[100vw] sm:min-w-[40vw]"
                    >
                      <Image
                        class="w-full"
                        sizes="(max-width: 640px) 100vw, 40vw"
                        style={{ aspectRatio: ASPECT_RATIO }}
                        src={img.url!}
                        alt={img.alternateName}
                        width={WIDTH}
                        height={HEIGHT}
                        // Preload LCP image for better web vitals
                        preload={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </Slider.Item>
                  ))}
                </Slider>

                <Slider.PrevButton
                  class="no-animation absolute left-2 top-1/2 btn btn-circle btn-outline"
                  disabled
                >
                  <Icon size={20} id="ChevronLeft" strokeWidth={3} />
                </Slider.PrevButton>

                <Slider.NextButton
                  class="no-animation absolute right-2 top-1/2 btn btn-circle btn-outline"
                  disabled={images.length < 2}
                >
                  <Icon size={20} id="ChevronRight" strokeWidth={3} />
                </Slider.NextButton>

                <div class="absolute top-2 right-2 bg-base-100 rounded-full">
                  <ProductImageZoom
                    images={images}
                    width={1280}
                    height={1280 * HEIGHT / WIDTH}
                  />
                </div>
              </div>

              {/* Dots */}

              <div id="preview-container">
                <ul
                  class={`${
                    imagesLayout === "side-by-side" && "flex-col"
                  } flex gap-2 justify-center sm:justify-start mt-4 sm:mt-0`}
                >
                  {images.map((img, index) =>
                    index < 4 && (
                      <li>
                        <Slider.Dot index={index}>
                          <Image
                            style={{ aspectRatio: ASPECT_RATIO }}
                            class="group-disabled:border-base-300 border rounded w-full"
                            src={img.url!}
                            width={imagesLayout === "side-by-side" ? 63 : 200}
                            height={imagesLayout === "side-by-side"
                              ? 87.5
                              : 200}
                            alt={img.alternateName}
                          />
                        </Slider.Dot>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}

          {imagesLayout === "vertical-galery" &&
            (
              <div class="grid grid-cols-2 gap-4 w-[30%]">
                {images.map((img, index) => {
                  if (index !== 2) {
                    return (
                      <Image
                        class="w-full col-span-1"
                        sizes="(max-width: 640px) 100vw, 40vw"
                        style={{ aspectRatio: ASPECT_RATIO }}
                        src={img.url!}
                        alt={img.alternateName}
                        width={WIDTH}
                        height={HEIGHT}
                        // Preload LCP image for better web vitals
                        preload={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    );
                  }

                  return (
                    <Image
                      class="w-full col-span-2 row-span-2"
                      sizes="(max-width: 640px) 100vw, 40vw"
                      style={{ aspectRatio: ASPECT_RATIO }}
                      src={img.url!}
                      alt={img.alternateName}
                      width={WIDTH}
                      height={HEIGHT}
                      // Preload LCP image for better web vitals
                      loading={"lazy"}
                    />
                  );
                })}
              </div>
            )}

          {/* Product Info */}
          <div class="px-4 sm:pr-0 sm:pl-6 sm:col-start-3 sm:col-span-1 sm:row-start-1">
            <ProductInfo page={page} />
          </div>
        </div>
        <SliderJS rootId={id}></SliderJS>
      </>
    );
  }

  /**
   * Product front-back variant.
   *
   * Renders two images side by side both on mobile and on desktop. On mobile, the overflow is
   * reached causing a scrollbar to be rendered.
   */
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-[50vw_25vw] sm:grid-rows-1 sm:justify-center">
      {/* Image slider */}
      <ul class="carousel carousel-center gap-6">
        {[images[0], images[1] ?? images[0]].map((img, index) => (
          <li class="carousel-item min-w-[100vw] sm:min-w-[24vw]">
            <Image
              sizes="(max-width: 640px) 100vw, 24vw"
              style={{ aspectRatio: ASPECT_RATIO }}
              src={img.url!}
              alt={img.alternateName}
              width={WIDTH}
              height={HEIGHT}
              // Preload LCP image for better web vitals
              preload={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ul>

      {/* Product Info */}
      <div class="px-4 sm:pr-0 sm:pl-6">
        <ProductInfo page={page} />
      </div>
    </div>
  );
}

function ProductDetails(
  { page, variant: maybeVar = "auto", imagesLayout }: Props,
) {
  /**
   * Showcase the different product views we have on this template. In case there are less
   * than two images, render a front-back, otherwhise render a slider
   * Remove one of them and go with the best suited for your use case.
   */
  const variant = maybeVar === "auto"
    ? page?.product.image?.length && page?.product.image?.length < 2
      ? "front-back"
      : "slider"
    : maybeVar;

  return (
    <div class="container py-0 sm:py-10">
      {page
        ? (
          <Details
            page={page}
            variant={variant}
            imagesLayout={imagesLayout}
          />
        )
        : <NotFound />}
    </div>
  );
}

export default ProductDetails;
