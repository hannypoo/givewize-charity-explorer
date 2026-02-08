import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
  showCount?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-8 w-8",
};

export function StarRating({
  rating = 0,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRate,
  showValue = false,
  showCount = false,
  reviewCount = 0,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => {
          const isFilled = displayRating >= star;
          const isHalf = !isFilled && displayRating >= star - 0.5;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              className={cn(
                "relative transition-transform duration-150",
                interactive && "cursor-pointer hover:scale-110",
                !interactive && "cursor-default"
              )}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onRate?.(star)}
              aria-label={interactive ? `Rate ${star} star${star !== 1 ? "s" : ""}` : undefined}
            >
              {/* Background (empty) star */}
              <Star className={cn(sizeMap[size], "text-muted")} />
              {/* Filled overlay */}
              {(isFilled || isHalf) && (
                <Star
                  className={cn(
                    sizeMap[size],
                    "absolute inset-0 fill-warning text-warning"
                  )}
                  style={isHalf ? { clipPath: "inset(0 50% 0 0)" } : undefined}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-foreground ml-1">
          {displayRating.toFixed(1)}
        </span>
      )}
      {showCount && reviewCount > 0 && (
        <span className="text-xs text-muted-foreground ml-1">
          ({reviewCount.toLocaleString()} review{reviewCount !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}
