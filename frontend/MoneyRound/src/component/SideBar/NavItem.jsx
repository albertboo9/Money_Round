import PropTypes from "prop-types";

const NavItem = ({ icon, text, isOpen, setIsOpen }) => {
  return (
    <div className="flex items-center gap-4 cursor-pointer w-full hover:text-blue-400">
      <span
        onClick={() => setIsOpen((prev) => !prev)}
        data-tooltip-id={!isOpen ? "sidebar-tooltip" : undefined}
        data-tooltip-content={!isOpen ? text : undefined}
        className="text-xl"
      >
        {icon}
      </span>
      {isOpen && <div>{text}</div>}
    </div>
  );
};
NavItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default NavItem;