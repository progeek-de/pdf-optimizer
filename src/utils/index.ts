//@ts-nocheck
const formatter = new Intl.NumberFormat("de", {
  notation: "compact",
  style: "unit",
  unit: "byte",
  unitDisplay: "narrow",
});

export function formatSize(size: number) {
  return formatter.format(size)
}
