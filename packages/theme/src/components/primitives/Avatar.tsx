"use client";

import Image from "next/image";
import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Fallback text (initials) or element when image fails */
  fallback?: string | React.ReactNode;
  /** Size of the avatar */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Shape of the avatar */
  shape?: "circle" | "square";
  /** Online status indicator */
  status?: "online" | "offline" | "away" | "busy";
  /** Border style */
  bordered?: boolean;
  /** Add glow effect */
  glow?: boolean;
}

const sizeStyles: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-20 h-20 text-2xl",
};

const statusSizeStyles: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border",
  md: "w-2.5 h-2.5 border-2",
  lg: "w-3 h-3 border-2",
  xl: "w-4 h-4 border-2",
  "2xl": "w-5 h-5 border-2",
};

const statusColors: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  away: "bg-amber-500",
  busy: "bg-red-500",
};

/**
 * Avatar Component
 *
 * Displays a user avatar with support for images, initials fallback,
 * and status indicators.
 *
 * @example
 * // With image
 * <Avatar src="/avatar.jpg" alt="John Doe" />
 *
 * // With initials fallback
 * <Avatar fallback="JD" />
 *
 * // With status
 * <Avatar src="/avatar.jpg" status="online" />
 *
 * // Custom size and shape
 * <Avatar size="xl" shape="square" fallback="AB" />
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = "",
      fallback,
      size = "md",
      shape = "circle",
      status,
      bordered = false,
      glow = false,
      ...props
    },
    ref,
  ) => {
    const [imageError, setImageError] = useState(false);
    const showFallback = !src || imageError;

    // Generate initials from fallback string
    const getInitials = (text: string): string => {
      const words = text.trim().split(/\s+/);
      if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
      }
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    const fallbackContent =
      typeof fallback === "string" ? getInitials(fallback) : fallback;

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {/* Avatar container */}
        <div
          className={cn(
            // Base styles
            "relative overflow-hidden flex items-center justify-center",
            "bg-muted text-muted-foreground font-medium",

            // Shape
            shape === "circle" ? "rounded-full" : "rounded-lg",

            // Size
            sizeStyles[size],

            // Border
            bordered &&
              "ring-2 ring-border ring-offset-2 ring-offset-background",

            // Glow
            glow && "shadow-glow",
          )}
        >
          {/* Image */}
          {!showFallback && (
            <Image
              src={src as string}
              alt={alt}
              fill
              sizes="100vw"
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          )}

          {/* Fallback */}
          {showFallback && (
            <span className="select-none">{fallbackContent}</span>
          )}
        </div>

        {/* Status indicator */}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0",
              "rounded-full border-background",
              statusSizeStyles[size],
              statusColors[status],
            )}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

/**
 * AvatarGroup Component
 *
 * Displays multiple avatars in a stacked layout.
 */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars to show before "+X" indicator */
  max?: number;
  /** Size for all avatars */
  size?: AvatarProps["size"];
  /** Children should be Avatar components */
  children: React.ReactNode;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size = "md", children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    const overlapStyles: Record<NonNullable<AvatarProps["size"]>, string> = {
      xs: "-space-x-2",
      sm: "-space-x-2.5",
      md: "-space-x-3",
      lg: "-space-x-4",
      xl: "-space-x-5",
      "2xl": "-space-x-6",
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center", overlapStyles[size], className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div
            key={index}
            className="ring-2 ring-background rounded-full"
            style={{ zIndex: visibleChildren.length - index }}
          >
            {React.isValidElement<AvatarProps>(child)
              ? React.cloneElement(child, { size })
              : child}
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className="ring-2 ring-background rounded-full"
            style={{ zIndex: 0 }}
          >
            <Avatar size={size} fallback={`+${remainingCount}`} />
          </div>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
