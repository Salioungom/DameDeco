"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowBack as ArrowLeft, ArrowForward as ArrowRight } from "@mui/icons-material";
import { Box, IconButton, Button } from "@mui/material";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  children,
  sx,
  ...props
}: React.ComponentProps<typeof Box> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <Box
        onKeyDownCapture={handleKeyDown}
        role="region"
        aria-roledescription="carousel"
        sx={{
          position: "relative",
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ sx, ...props }: React.ComponentProps<typeof Box>) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <Box
      ref={carouselRef}
      sx={{ overflow: "hidden" }}
    >
      <Box
        sx={{
          display: "flex",
          ...(orientation === "horizontal" ? { marginLeft: "-1rem" } : { marginTop: "-1rem", flexDirection: "column" }),
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
}

function CarouselItem({ sx, ...props }: React.ComponentProps<typeof Box>) {
  const { orientation } = useCarousel();

  return (
    <Box
      role="group"
      aria-roledescription="slide"
      sx={{
        minWidth: 0,
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: "100%",
        ...(orientation === "horizontal" ? { paddingLeft: "1rem" } : { paddingTop: "1rem" }),
        ...sx,
      }}
      {...props}
    />
  );
}

function CarouselPrevious({
  variant = "outlined",
  size = "small",
  sx,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      variant={variant}
      size={size}
      sx={{
        position: "absolute",
        minWidth: "2rem",
        width: "2rem",
        height: "2rem",
        borderRadius: "50%",
        padding: 0,
        ...(orientation === "horizontal"
          ? { top: "50%", left: "-3rem", transform: "translateY(-50%)" }
          : { top: "-3rem", left: "50%", transform: "translateX(-50%) rotate(90deg)" }),
        ...sx,
      }}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: 0 }}>
        Previous slide
      </Box>
    </Button>
  );
}

function CarouselNext({
  variant = "outlined",
  size = "small",
  sx,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      variant={variant}
      size={size}
      sx={{
        position: "absolute",
        minWidth: "2rem",
        width: "2rem",
        height: "2rem",
        borderRadius: "50%",
        padding: 0,
        ...(orientation === "horizontal"
          ? { top: "50%", right: "-3rem", transform: "translateY(-50%)" }
          : { bottom: "-3rem", left: "50%", transform: "translateX(-50%) rotate(90deg)" }),
        ...sx,
      }}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: 0 }}>
        Next slide
      </Box>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
