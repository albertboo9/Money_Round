import { motion } from 'framer-motion';
import PropTypes from "prop-types";

function SearchBar({ value, onChange }) {
  return (
    <motion.div 
      className="search-bar"
      initial={{ opacity: 0.8 }}
      whileFocus={{ opacity: 1 }}
    >
    
      <input
        type="text"
        placeholder="Rechercher..."
        value={value}
        onChange={onChange}
        className="search-input"
      />
    </motion.div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default SearchBar;