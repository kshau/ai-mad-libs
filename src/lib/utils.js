import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getSubstringBetween(str, startStr, endStr) {

  const startIndex = str.indexOf(startStr);

  if (startIndex == -1) {
      return "";
  }

  const endIndex = str.indexOf(endStr, startIndex + startStr.length);
  if (endIndex == -1) {
      return "";
  }

  return str.substring(startIndex + startStr.length, endIndex);
}