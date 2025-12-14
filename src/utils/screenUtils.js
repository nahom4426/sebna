import { computed, onUnmounted } from "vue";
import { onMounted, ref } from "vue";

export function getWindowWidth() {
  return window.innerWidth;
}

export function getWindowHeight() {
  return window.innerHeight;
}

export function isMobileScreen() {
  return window.innerWidth < 768;
}

export function isTabletScreen() {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

export function isDesktopScreen() {
  return window.innerWidth >= 1024;
}

export function useScreenSize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const updateSize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener("resize", updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateSize);
  });

  return {
    width,
    height,
    isMobile: computed(() => width.value < 768),
    isTablet: computed(() => width.value >= 768 && width.value < 1024),
    isDesktop: computed(() => width.value >= 1024),
    isLargeDesktop: computed(() => width.value >= 1440),
  };
}

export function getScreenSizeCategory() {
  const width = window.innerWidth;

  if (width < 640) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  if (width < 1280) return "lg";
  if (width < 1536) return "xl";
  return "2xl";
}

export function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}
