import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface PremiumCTAButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  fullWidthMobile?: boolean;
}

export const PremiumCTAButton: React.FC<PremiumCTAButtonProps> = ({ 
  text, 
  onClick, 
  className,
  fullWidthMobile = false
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-full font-bold text-[#0B1830] shadow-lg transition-all duration-300",
        "bg-[#D6A84B] hover:bg-gradient-to-r hover:from-[#D6A84B] hover:to-[#E5B556]",
        "px-8 py-4 text-[clamp(14px,1.1vw,16px)] flex items-center justify-center gap-2",
        "border border-transparent hover:border-[#F0C860]",
        fullWidthMobile ? "w-full md:w-auto" : "",
        className
      )}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-120%' }}
        whileHover={{ x: '120%', transition: { duration: 0.7, ease: "easeInOut" } }}
      />
      
      <span>{text}</span>
      <motion.span
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
        className="flex items-center"
      >
        <ArrowRight className="w-5 h-5" />
      </motion.span>
    </motion.button>
  );
};
