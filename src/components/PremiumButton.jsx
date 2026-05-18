import {
  motion,
} from "framer-motion";

function PremiumButton({

  children,
  className = "",
  ...props

}) {

  return (

    <motion.button

      whileHover={{
        scale: 1.03,
      }}

      whileTap={{
        scale: 0.96,
      }}

      className={`relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl transition-all duration-300 ${className}`}

      {...props}
    >

      {children}

    </motion.button>
  );
}

export default PremiumButton;