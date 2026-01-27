"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBreadcrumbs } from "@/store/features/breadcrumb/breadcrumbSlice";
import { useCallback } from "react";

// Define types for breadcrumb items
export interface BreadcrumbItemWithClick {
  label: string;
  href?: string;
  onClick?: () => void;
}

// Type for items stored in Redux (serializable)
export interface SerializableBreadcrumbItem {
  label: string;
  href?: string;
  hasOnClick?: boolean;
}

// Better approach using module-level storage
const clickHandlers: Record<number, () => void> = {};

export const useBreadcrumbs = () => {
  const dispatch = useAppDispatch();
  const storedBreadcrumbs = useAppSelector(
    (state) => state.breadcrumb.breadcrumbs
  );

  const updateBreadcrumbs = useCallback(
    (items: BreadcrumbItemWithClick[]) => {
      // Clear previous handlers
      Object.keys(clickHandlers).forEach(
        (key) => delete clickHandlers[Number(key)]
      );

      // Convert items to serializable format and store onClick handlers
      const serializableItems = items.map((item, index) => {
        const { onClick, ...rest } = item;

        // Store onClick handler if it exists
        if (onClick) {
          clickHandlers[index] = onClick;
        }

        return {
          ...rest,
          hasOnClick: !!onClick,
        };
      });

      dispatch(setBreadcrumbs(serializableItems));
    },
    [dispatch]
  );

  // Reconstruct breadcrumbs with onClick handlers
  const breadcrumbsWithHandlers = storedBreadcrumbs.map((item, index) => ({
    ...item,
    onClick: item.hasOnClick ? clickHandlers[index] : undefined,
  }));

  return {
    breadcrumbs: breadcrumbsWithHandlers,
    setBreadcrumbs: updateBreadcrumbs,
  };
};
